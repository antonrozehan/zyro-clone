from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db.models import Q
from products.models import Product, Category, Order, OrderItem, Review
from .serializers import ProductSerializer, CategorySerializer, OrderSerializer, ReviewSerializer, ProductDetailSerializer
from rest_framework import status
import uuid
import re
from django.conf import settings
import google.generativeai as genai
import logging

# Настройка логирования
logger = logging.getLogger(__name__)

# Настройка Google Gemini
try:
    if hasattr(settings, 'GEMINI_API_KEY') and settings.GEMINI_API_KEY:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel('gemini-1.5-flash')
        logger.info("Gemini AI initialized successfully")
    else:
        gemini_model = None
        logger.warning("GEMINI_API_KEY not found in settings")
except Exception as e:
    gemini_model = None
    logger.error(f"Failed to initialize Gemini: {e}")

def detect_language(text: str) -> str:
    """Определение языка вопроса"""
    text_lower = text.lower()
    
    # Польские слова-маркеры
    pl_markers = ['jak', 'co', 'czy', 'jaki', 'gdzie', 'kiedy', 'dlaczego', 
                  'proszę', 'dzień', 'dobry', 'cześć', 'witaj', 'cen', 'dostawa',
                  'zwrot', 'pomoc', 'dziekuje', 'dlaczego', 'który']
    if any(word in text_lower for word in pl_markers):
        return 'pl'
    
    # Английские слова-маркеры
    en_markers = ['what', 'price', 'delivery', 'how', 'when', 'where', 'why', 
                  'hello', 'hi', 'help', 'return', 'cost', 'much', 'which', 'refund']
    if any(word in text_lower for word in en_markers):
        return 'en'
    
    # Русские слова-маркеры
    ru_markers = ['что', 'цена', 'доставка', 'как', 'когда', 'где', 'почему', 
                  'привет', 'помоги', 'сколько', 'стоит', 'вернуть', 'какой', 'помощь']
    if any(word in text_lower for word in ru_markers):
        return 'ru'
    
    # Проверка по кириллице (русский)
    if re.search('[а-яА-Я]', text):
        return 'ru'
    
    # Проверка по латинице с польскими буквами
    if re.search('[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]', text):
        return 'pl'
    
    # По умолчанию английский
    return 'en'

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        queryset = Product.objects.all()
        product_type = self.request.query_params.get('type', None)
        category = self.request.query_params.get('category', None)
        search = self.request.query_params.get('search', None)
        
        if product_type:
            queryset = queryset.filter(product_type=product_type)
        if category:
            queryset = queryset.filter(category__slug=category)
        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(description__icontains=search))
            
        return queryset

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

@api_view(['GET'])
def featured_products(request):
    products = Product.objects.filter(is_featured=True)[:6]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def recommended_products(request):
    products = Product.objects.order_by('-rating')[:8]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    
    def get_queryset(self):
        product_id = self.request.query_params.get('product', None)
        if product_id:
            return self.queryset.filter(product_id=product_id)
        return self.queryset
    
    def perform_create(self, serializer):
        serializer.save()
    
    def create(self, request, *args, **kwargs):
        """Создание отзыва с поддержкой фото"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class ProductDetailViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductSerializer
    
    def get_queryset(self):
        queryset = Product.objects.all()
        product_type = self.request.query_params.get('type', None)
        category = self.request.query_params.get('category', None)
        search = self.request.query_params.get('search', None)
        
        if product_type:
            queryset = queryset.filter(product_type=product_type)
        if category:
            queryset = queryset.filter(category__slug=category)
        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(description__icontains=search))
            
        return queryset

def get_gemini_response(message: str) -> str:
    """Получение ответа от Google Gemini AI на языке пользователя"""
    if gemini_model is None:
        return None
    
    # Определяем язык сообщения
    lang = detect_language(message)
    
    # Инструкции по языку
    language_instructions = {
        'ru': 'Ответь на русском языке. Используй эмодзи. Будь вежливым и полезным.',
        'en': 'Answer in English language. Use emojis. Be polite and helpful.',
        'pl': 'Odpowiedz w języku polskim. Używaj emoji. Bądź uprzejmy i pomocny.'
    }
    
    greetings = {
        'ru': 'Привет! 👋',
        'en': 'Hello! 👋',
        'pl': 'Witaj! 👋'
    }
    
    try:
        system_prompt = f"""
        Ты - виртуальный помощник интернет-магазина Zyro. 
        Твоя задача - помогать пользователям с вопросами о товарах, доставке, оплате, возвратах.
        Имя магазина Zyro. Ты - дружелюбный ассистент.
        
        Контекст о магазине:
        - Мы продаем наушники, колонки и аудио-аксессуары
        - Доставка по всему миру: стандартная 3-5 дней ($9.99), экспресс 1-2 дня ($19.99), бесплатная при заказе от $100
        - Возврат в течение 30 дней, 100% гарантия
        - Способы оплаты: кредитная карта, PayPal, наличные при получении
        
        ВАЖНОЕ ПРАВИЛО: {language_instructions[lang]}
        
        Вопрос пользователя: {message}
        
        Ответ:
        """
        
        response = gemini_model.generate_content(system_prompt)
        return response.text
    except Exception as e:
        logger.error(f"Gemini API error: {e}")
        return None

def get_bot_response(message: str, use_ai: bool = True) -> str:
    """Получение ответа с возможностью использовать AI"""
    # Определяем язык для fallback ответов
    lang = detect_language(message)
    
    # Fallback ответы на разных языках
    fallback_responses = {
        'price': {
            'ru': "💰 Цены на наши товары:\n• Наушники: от $49.99 до $399.99\n• Колонки: от $89.99 до $299.99\n• Аудио-очки: от $129.99\n\nВсе актуальные цены указаны на карточках товаров!",
            'en': "💰 Our prices:\n• Headphones: $49.99 - $399.99\n• Speakers: $89.99 - $299.99\n• Audio glasses: $129.99\n\nCheck product cards for current prices!",
            'pl': "💰 Nasze ceny:\n• Słuchawki: $49.99 - $399.99\n• Głośniki: $89.99 - $299.99\n• Okulary audio: $129.99\n\nAktualne ceny na kartach produktów!"
        },
        'delivery': {
            'ru': "🚚 Информация о доставке:\n\n• Стандартная: 3-5 дней - $9.99\n• Экспресс: 1-2 дня - $19.99\n• Бесплатная: при заказе от $100\n\nМы доставляем по всему миру!",
            'en': "🚚 Delivery info:\n\n• Standard: 3-5 days - $9.99\n• Express: 1-2 days - $19.99\n• Free: on orders over $100\n\nWe ship worldwide!",
            'pl': "🚚 Informacja o dostawie:\n\n• Standardowa: 3-5 dni - $9.99\n• Ekspresowa: 1-2 dni - $19.99\n• Darmowa: przy zamówieniu powyżej $100\n\nWysyłamy na cały świat!"
        },
        'return': {
            'ru': "✅ Политика возврата:\n\n• 30 дней на возврат товара\n• 100% возврат денег\n• Бесплатный возврат в течении 14 дней\n• Товар должен быть в оригинальной упаковке",
            'en': "✅ Return policy:\n\n• 30 days to return\n• 100% money back\n• Free returns within 14 days\n• Product must be in original packaging",
            'pl': "✅ Polityka zwrotów:\n\n• 30 dni na zwrot\n• 100% zwrotu pieniędzy\n• Darmowy zwrot w ciągu 14 dni\n• Produkt musi być w oryginalnym opakowaniu"
        },
        'greeting': {
            'ru': "👋 Здравствуйте! Рады вас видеть! Чем могу помочь? Выберите один из быстрых вопросов или напишите свой!",
            'en': "👋 Hello! Glad to see you! How can I help? Choose a quick question or type your own!",
            'pl': "👋 Witaj! Miło cię widzieć! Jak mogę pomóc? Wybierz szybkie pytanie lub napisz swoje!"
        },
        'goodbye': {
            'ru': "👋 До свидания! Будем рады видеть вас снова! Хорошего дня!",
            'en': "👋 Goodbye! We'll be glad to see you again! Have a nice day!",
            'pl': "👋 Do widzenia! Chętnie zobaczymy cię ponownie! Miłego dnia!"
        },
        'default': {
            'ru': "😊 Спасибо за ваш вопрос!\n\nЯ еще учусь отвечать на все вопросы. Попробуйте выбрать один из быстрых вопросов выше или напишите нам на email: support@zyro.com",
            'en': "😊 Thanks for your question!\n\nI'm still learning to answer all questions. Try one of the quick questions above or email us at support@zyro.com",
            'pl': "😊 Dziękujemy za pytanie!\n\nWciąż uczę się odpowiadać na wszystkie pytania. Wypróbuj jedno z szybkich pytań powyżej lub napisz do nas na email: support@zyro.com"
        }
    }
    
    # Пытаемся использовать AI
    if use_ai:
        ai_response = get_gemini_response(message)
        if ai_response:
            return ai_response
    
    # Fallback на обычного бота с определением языка
    msg = message.lower().strip()
    
    # Определяем категорию вопроса
    price_keywords = ['цена', 'цены', 'сколько стоит', 'price', 'стоимость', 'дорого', 'дешево', 'cena', 'ceni', 'koszt']
    delivery_keywords = ['доставка', 'delivery', 'отправка', 'придет', 'приедет', 'когда получу', 'dostawa', 'wysyłka']
    return_keywords = ['возврат', 'return', 'вернуть', 'гарантия', 'обмен', 'не подошел', 'zwrot', 'gwarancja']
    greeting_keywords = ['привет', 'здравствуй', 'hello', 'добрый день', 'hi', 'hey', 'cześć', 'witaj', 'dzień dobry']
    goodbye_keywords = ['пока', 'bye', 'до свидания', 'удачи', 'do widzenia', 'żegnaj']
    
    if any(word in msg for word in price_keywords):
        return fallback_responses['price'][lang]
    elif any(word in msg for word in delivery_keywords):
        return fallback_responses['delivery'][lang]
    elif any(word in msg for word in return_keywords):
        return fallback_responses['return'][lang]
    elif any(word in msg for word in greeting_keywords):
        return fallback_responses['greeting'][lang]
    elif any(word in msg for word in goodbye_keywords):
        return fallback_responses['goodbye'][lang]
    else:
        return fallback_responses['default'][lang]

@api_view(['POST'])
def chat_bot(request):
    user_message = request.data.get('message', '')
    user_name = request.data.get('user_name', 'Guest')
    session_id = request.data.get('session_id', str(uuid.uuid4()))
    is_operator_mode = request.data.get('is_operator_mode', False)
    use_ai = request.data.get('use_ai', True)
    
    # Определяем язык для логов
    lang = detect_language(user_message)
    print(f"📨 Chat request - message: {user_message[:50]}..., language: {lang}, use_ai: {use_ai}")
    
    # Выбираем тип ответа
    if is_operator_mode:
        operator_messages = {
            'ru': "👨‍💼 Оператор скоро ответит вам. Пожалуйста, ожидайте...",
            'en': "👨‍💼 An operator will answer you shortly. Please wait...",
            'pl': "👨‍💼 Operator odpowie ci wkrótce. Proszę czekać..."
        }
        bot_response = operator_messages.get(lang, operator_messages['en'])
        msg_type = 'operator'
    elif use_ai:
        bot_response = get_bot_response(user_message, use_ai=True)
        msg_type = 'ai'
        print(f"🤖 AI response generated ({lang}): {bot_response[:100]}...")
    else:
        bot_response = get_bot_response(user_message, use_ai=False)
        msg_type = 'bot'
    
    return Response({
        'response': bot_response,
        'session_id': session_id,
        'is_operator_mode': is_operator_mode,
        'is_ai': use_ai,
        'message_type': msg_type
    })

@api_view(['POST'])
def switch_to_operator(request):
    session_id = request.data.get('session_id')
    
    return Response({
        'status': 'switched',
        'message': 'Оператор подключен. Чем могу помочь?'
    })

@api_view(['GET'])
def get_chat_history(request):
    return Response({
        'messages': [],
        'message': 'История чата временно недоступна'
    })