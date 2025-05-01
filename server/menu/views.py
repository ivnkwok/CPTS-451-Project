import json
from rest_framework import generics, permissions
from .models import MenuItem
from .serializers import MenuItemSerializer
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import get_object_or_404
from django.http import JsonResponse, Http404
from django.db import IntegrityError
from decimal import Decimal, InvalidOperation

class MenuItemCreateView(generics.CreateAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.AllowAny]

class MenuItemListView(generics.ListAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """
        Optionally filters the queryset by:
          - category
          - min_price, max_price
          - dietary (exact or partial match)
        """
        queryset = super().get_queryset()
        request = self.request
        category = request.query_params.get('category', None)
        min_price = request.query_params.get('min_price', None)
        max_price = request.query_params.get('max_price', None)
        dietary = request.query_params.get('dietary', None)

        # Filter by category (case-insensitive exact match)
        if category:
            queryset = queryset.filter(category__iexact=category)

        # Filter by min_price
        if min_price is not None:
            queryset = queryset.filter(price__gte=min_price)

        # Filter by max_price
        if max_price is not None:
            queryset = queryset.filter(price__lte=max_price)

        # Filter by dietary restriction (very basic substring search)
        if dietary:
            queryset = queryset.filter(dietary_restrictions__icontains=dietary)

        return queryset

def is_staff_or_admin(user):
    return user.is_staff or user.is_superuser

@csrf_exempt
@api_view(["PUT"])
def UpdateMenuItem(request, id):
    try:
        item_to_update = get_object_or_404(MenuItem, pk=id)
    except NameError:
        return JsonResponse({"error": "MenuItem model not found or imported."}, status=500)
    except Http404:
        return JsonResponse({"error": "Menu item not found."}, status=404)
    
    try:
        if not request.body:
            return JsonResponse({"error": "Request body cannot be empty for update."}, status = 400)
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format."}, status=400)
    
    updated_fields=[]
    errors={}

    if 'name' in data:
        new_name = data['name'].strip()
        if not new_name:
            errors['name'] = "Name cannot be empty."
        elif new_name != item_to_update.name:
            # Check if the new name is already taken by another item
             # Replace 'MenuItem' with your actual model name
            if MenuItem.objects.filter(name=new_name).exclude(pk=item_to_update.pk).exists():
                errors['name'] = "This menu item name is already taken."
            else:
                item_to_update.name = new_name
                updated_fields.append('name')

    # Update description if provided
    if 'description' in data:
        # Allow empty description
        item_to_update.description = data['description']
        updated_fields.append('description')

    # Update price if provided
    if 'price' in data:
        try:
            new_price = Decimal(str(data['price'])) # Convert to Decimal
            if new_price < Decimal('0.00'):
                errors['price'] = "Price cannot be negative."
            else:
                item_to_update.price = new_price
                updated_fields.append('price')
        except (InvalidOperation, TypeError, ValueError):
             errors['price'] = "Invalid price format. Please provide a valid number."

    # Update category if provided
    if 'category' in data:
        # Add validation if category should map to specific choices or a ForeignKey
        item_to_update.category = data['category'].strip()
        updated_fields.append('category')

    if 'nutritional_info' in data:
        # Add validation if category should map to specific choices or a ForeignKey
        item_to_update.nutritional_info = data['nutritional_info'].strip()
        updated_fields.append('nutritional_info')

    if 'dietary_restrictions' in data:
        # Add validation if category should map to specific choices or a ForeignKey
        item_to_update.dietary_restrictions = data['dietary_restrictions'].strip()
        updated_fields.append('dietary_restrictions')

    # --- Handle Validation Errors ---
    if errors:
        return JsonResponse({"errors": errors}, status=400)

    # --- Save and Respond ---
    if not updated_fields:
         return JsonResponse({"message": "No valid fields provided to update."}, status=400)

    try:
        item_to_update.save()
        # Return the updated item data
        # Adjust the fields returned based on your MenuItem model
        return JsonResponse({
            "message": "Menu item updated successfully.",
            "menu_item": {
                "id": item_to_update.id,
                "name": item_to_update.name,
                "price": str(item_to_update.price), # Convert Decimal to string for JSON
                "category": item_to_update.category,
                "nutritional_info": item_to_update.nutritional_info,
                "dietary_restrictions": item_to_update.dietary_restrictions,
                # Add other relevant fields from your model
            },
            "updated_fields": updated_fields
        })
    except IntegrityError as e: # Catch potential database constraint errors (e.g., unique name)
         # You might want to parse the specific error to give a better message
         error_message = f"Database error: {str(e)}"
         if 'UNIQUE constraint' in str(e) and 'name' in str(e):
              error_message = "This menu item name is already taken."
         return JsonResponse({"error": error_message}, status=400)
    except Exception as e:
        # Catch other potential errors during save
        return JsonResponse({"error": f"An error occurred during save: {str(e)}"}, status=500)