from rest_framework import serializers
from products.models import Product, Category, Order, OrderItem, Review, ChatMessage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'old_price', 'category', 
                  'category_name', 'product_type', 'image', 'rating', 'reviews_count', 
                  'is_featured', 'calories_burned', 'created_at']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            representation['image'] = instance.image.url
        return representation

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product_id', 'product_name', 'product_price', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, write_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'full_name', 'email', 'phone', 'address', 'city', 'zip_code', 
                  'country', 'payment_method', 'shipping_method', 'shipping_price', 
                  'subtotal', 'total', 'order_note', 'status', 'created_at', 'items']
        read_only_fields = ['id', 'status', 'created_at']
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order

class ReviewSerializer(serializers.ModelSerializer):
    admin_reply = serializers.CharField(read_only=True)
    admin_reply_date = serializers.DateTimeField(read_only=True)
    photo_url = serializers.SerializerMethodField()  # 👈 ДОБАВИТЬ
    
    class Meta:
        model = Review
        fields = ['id', 'product', 'user_name', 'rating', 'comment', 'photo', 'photo_url',
                  'admin_reply', 'admin_reply_date', 'created_at', 'is_approved', 'is_verified']
        read_only_fields = ['id', 'created_at', 'admin_reply', 'admin_reply_date', 'is_approved']
    
    def get_photo_url(self, obj):
        if obj.photo:
            return obj.photo.url
        return None

class ProductDetailSerializer(ProductSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    
    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + ['reviews', 'average_rating']
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.filter(is_approved=True)
        if reviews.exists():
            return round(sum(r.rating for r in reviews) / reviews.count(), 1)
        return obj.rating or 0

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'user_name', 'user_message', 'bot_response', 'is_read', 'created_at']
        