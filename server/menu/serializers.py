from rest_framework import serializers
from .models import MenuItem, Order, OrderItem

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'price', 'category', 'is_available', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item = MenuItemSerializer(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'quantity', 'price_at_time', 'subtotal', 'notes']
        read_only_fields = ['price_at_time', 'subtotal']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    student_balance = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'student', 'staff', 'status', 'total_amount', 'created_at', 'updated_at', 'notes', 'items', 'student_balance']
        read_only_fields = ['created_at', 'updated_at', 'student_balance']

    def get_student_balance(self, obj):
        return obj.student.balance

    def validate(self, data):
        if data.get('total_amount', 0) > data.get('student').balance:
            raise serializers.ValidationError("Insufficient balance for this order")
        return data 