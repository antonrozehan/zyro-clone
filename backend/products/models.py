from django.db import models
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50, blank=True, null=True)
    
    def __str__(self):
        return self.name

class Product(models.Model):
    PRODUCT_TYPES = [
        ('headphone', 'Headphones & Earbuds'),
        ('speaker', 'Speakers'),
        ('audio', 'Audio Speakers'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    old_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPES)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    rating = models.FloatField(default=4.5)
    reviews_count = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    calories_burned = models.CharField(max_length=50, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    PAYMENT_METHODS = [
        ('card', 'Credit Card'),
        ('paypal', 'PayPal'),
        ('cash', 'Cash on Delivery'),
    ]
    
    SHIPPING_METHODS = [
        ('standard', 'Standard (3-5 days)'),
        ('express', 'Express (1-2 days)'),
        ('free', 'Free (5-7 days)'),
    ]
    
    # Связь с пользователем
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='orders')
    
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    city = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, default='USA')
    
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, default='card')
    shipping_method = models.CharField(max_length=20, choices=SHIPPING_METHODS, default='standard')
    shipping_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    order_note = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Order #{self.id} - {self.full_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product_id = models.IntegerField()
    product_name = models.CharField(max_length=200)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    
    def __str__(self):
        return f"{self.product_name} x {self.quantity}"

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user_name = models.CharField(max_length=100)
    user_email = models.EmailField(blank=True, null=True)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)], default=5)
    comment = models.TextField()
    photo = models.ImageField(upload_to='reviews/', blank=True, null=True)  # 👈 ДОБАВИТЬ ЭТУ СТРОКУ
    admin_reply = models.TextField(blank=True, null=True, verbose_name="Admin Reply")
    admin_reply_date = models.DateTimeField(blank=True, null=True, verbose_name="Reply Date")
    is_approved = models.BooleanField(default=True, verbose_name="Approved")
    is_verified = models.BooleanField(default=False, verbose_name="Verified Purchase")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Review"
        verbose_name_plural = "Reviews"
    
    def __str__(self):
        return f"{self.user_name} - {self.product.name} - {self.rating}★"

class ChatMessage(models.Model):
    MESSAGE_TYPES = [
        ('user', 'User'),
        ('bot', 'Bot'),
        ('operator', 'Operator'),
        ('ai', 'AI Assistant'),
    ]
    
    session_id = models.CharField(max_length=100, db_index=True)
    user_name = models.CharField(max_length=100, default='Guest')
    message = models.TextField()
    response = models.TextField(blank=True, null=True)
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES, default='user')
    is_operator_mode = models.BooleanField(default=False)
    operator_id = models.IntegerField(blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.get_message_type_display()}: {self.message[:50]}"