from django.contrib import admin
from django.utils import timezone
from .models import Category, Product, Order, OrderItem, Review

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'icon']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'product_type', 'rating', 'is_featured', 'created_at']
    list_filter = ['product_type', 'is_featured', 'category']
    search_fields = ['name', 'description']
    list_editable = ['price', 'rating', 'is_featured']

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_id', 'product_name', 'product_price', 'quantity']
    can_delete = False

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'full_name', 'email', 'phone', 'total', 'status', 'created_at']
    list_filter = ['status', 'payment_method', 'shipping_method', 'created_at']
    search_fields = ['full_name', 'email', 'phone', 'id']
    readonly_fields = ['id', 'created_at', 'updated_at', 'subtotal', 'total', 'shipping_price']
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Customer Information', {
            'fields': ('full_name', 'email', 'phone', 'address', 'city', 'zip_code', 'country')
        }),
        ('Order Information', {
            'fields': ('status', 'payment_method', 'shipping_method', 'shipping_price', 'subtotal', 'total', 'order_note')
        }),
        ('Timestamps', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_processing', 'mark_as_shipped', 'mark_as_delivered']
    
    def mark_as_processing(self, request, queryset):
        updated = queryset.update(status='processing')
        self.message_user(request, f'{updated} orders marked as processing.')
    mark_as_processing.short_description = 'Mark selected orders as Processing'
    
    def mark_as_shipped(self, request, queryset):
        updated = queryset.update(status='shipped')
        self.message_user(request, f'{updated} orders marked as shipped.')
    mark_as_shipped.short_description = 'Mark selected orders as Shipped'
    
    def mark_as_delivered(self, request, queryset):
        updated = queryset.update(status='delivered')
        self.message_user(request, f'{updated} orders marked as delivered.')
    mark_as_delivered.short_description = 'Mark selected orders as Delivered'

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user_name', 'product', 'rating', 'is_approved', 'has_reply', 'created_at']
    list_filter = ['rating', 'is_approved', 'is_verified', 'created_at']
    search_fields = ['user_name', 'comment', 'product__name', 'admin_reply']
    list_editable = ['is_approved']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Review Information', {
            'fields': ('product', 'user_name', 'user_email', 'rating', 'comment', 'is_approved', 'is_verified')
        }),
        ('Admin Reply', {
            'fields': ('admin_reply', 'admin_reply_date'),
            'classes': ('wide',),
            'description': 'You can reply to this customer review here. The reply will appear on the website.'
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_reply(self, obj):
        return bool(obj.admin_reply)
    has_reply.boolean = True
    has_reply.short_description = 'Has Reply'
    
    def save_model(self, request, obj, form, change):
        if obj.admin_reply and not obj.admin_reply_date:
            obj.admin_reply_date = timezone.now()
        super().save_model(request, obj, form, change)
    
    actions = ['approve_reviews', 'unapprove_reviews']
    
    def approve_reviews(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'{updated} reviews approved.')
    approve_reviews.short_description = 'Approve selected reviews'
    
    def unapprove_reviews(self, request, queryset):
        updated = queryset.update(is_approved=False)
        self.message_user(request, f'{updated} reviews unapproved.')
    unapprove_reviews.short_description = 'Unapprove selected reviews'
