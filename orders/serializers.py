# food_order_project/orders/serializers.py

from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product

class ProductInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['name']

class OrderItemSerializer(serializers.ModelSerializer):
    # Бул жерде биз эми 'product' талаасын жазууга да уруксат беребиз
    product_id = serializers.IntegerField(write_only=True)
    product = ProductInfoSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['product_id', 'product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True) # read_only=True'ну алып салдык

    class Meta:
        model = Order
        fields = [
            'id', 
            'delivery_address', 
            'items', 
            'total_amount',
            'order_date', 
            'status', 
            'order_type' # Бул талаа эми жазылат
        ]
        # order_type талаасын окуу үчүн гана кылып койбойбуз
        read_only_fields = ['order_date', 'status']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # --- ЭҢ МААНИЛҮҮ ӨЗГӨРТҮҮ ---
        # Эгер 'order_type' келбесе, демейки 'online' маанисин колдонуу
        if 'order_type' not in validated_data:
            validated_data['order_type'] = 'online'
            
        order = Order.objects.create(**validated_data)
        
        for item_data in items_data:
            product_id = item_data.pop('product_id')
            product = Product.objects.get(id=product_id)
            OrderItem.objects.create(order=order, product=product, **item_data)
            
        return order