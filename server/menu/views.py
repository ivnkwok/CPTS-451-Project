import json
from decimal import Decimal, InvalidOperation

from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import get_object_or_404
from django.http import JsonResponse, Http404
from django.db import IntegrityError

from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import MenuItem
from .serializers import MenuItemSerializer
from users.models import Balance


def is_staff_or_admin(user):
    return user.is_staff or user.is_superuser


class MenuItemCreateView(generics.CreateAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.AllowAny]

class MenuItemDestroyView(generics.RetrieveDestroyAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAdminUser]

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
        category = request.query_params.get('category')
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        dietary = request.query_params.get('dietary')

        if category:
            queryset = queryset.filter(category__iexact=category)
        if min_price is not None:
            queryset = queryset.filter(price__gte=min_price)
        if max_price is not None:
            queryset = queryset.filter(price__lte=max_price)
        if dietary:
            queryset = queryset.filter(dietary_restrictions__icontains=dietary)

        return queryset


@csrf_exempt
@api_view(["PUT"])
def UpdateMenuItem(request, id):
    """
    Update fields on an existing MenuItem.
    Only staff or superuser should be allowed (use is_staff_or_admin in your URLconf or decorator).
    """
    try:
        item_to_update = get_object_or_404(MenuItem, pk=id)
    except NameError:
        return JsonResponse({"error": "MenuItem model not found or imported."}, status=500)
    except Http404:
        return JsonResponse({"error": "Menu item not found."}, status=404)

    try:
        if not request.body:
            return JsonResponse({"error": "Request body cannot be empty for update."}, status=400)
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format."}, status=400)

    updated_fields = []
    errors = {}

    # name
    if 'name' in data:
        new_name = data['name'].strip()
        if not new_name:
            errors['name'] = "Name cannot be empty."
        elif new_name != item_to_update.name:
            if MenuItem.objects.filter(name=new_name).exclude(pk=item_to_update.pk).exists():
                errors['name'] = "This menu item name is already taken."
            else:
                item_to_update.name = new_name
                updated_fields.append('name')

    # description
    if 'description' in data:
        item_to_update.description = data['description']
        updated_fields.append('description')

    # price
    if 'price' in data:
        try:
            new_price = Decimal(str(data['price']))
            if new_price < Decimal('0.00'):
                errors['price'] = "Price cannot be negative."
            else:
                item_to_update.price = new_price
                updated_fields.append('price')
        except (InvalidOperation, TypeError, ValueError):
            errors['price'] = "Invalid price format. Please provide a valid number."

    # category
    if 'category' in data:
        item_to_update.category = data['category'].strip()
        updated_fields.append('category')

    # nutritional_info
    if 'nutritional_info' in data:
        item_to_update.nutritional_info = data['nutritional_info'].strip()
        updated_fields.append('nutritional_info')

    # dietary_restrictions
    if 'dietary_restrictions' in data:
        item_to_update.dietary_restrictions = data['dietary_restrictions'].strip()
        updated_fields.append('dietary_restrictions')

    # validation errors?
    if errors:
        return JsonResponse({"errors": errors}, status=400)

    if not updated_fields:
        return JsonResponse({"message": "No valid fields provided to update."}, status=400)

    # save
    try:
        item_to_update.save()
        return JsonResponse({
            "message": "Menu item updated successfully.",
            "menu_item": {
                "id": item_to_update.id,
                "name": item_to_update.name,
                "price": str(item_to_update.price),
                "category": item_to_update.category,
                "nutritional_info": item_to_update.nutritional_info,
                "dietary_restrictions": item_to_update.dietary_restrictions,
            },
            "updated_fields": updated_fields
        })
    except IntegrityError as e:
        error_message = "Database error: " + str(e)
        if 'UNIQUE constraint' in str(e) and 'name' in str(e):
            error_message = "This menu item name is already taken."
        return JsonResponse({"error": error_message}, status=400)
    except Exception as e:
        return JsonResponse({"error": f"An error occurred during save: {str(e)}"}, status=500)


@api_view(['GET'])
@permission_classes([AllowAny])
def public_stats_view(request):
    """
    Public endpoint returning all users' balances and menu item purchase counts.
    """
    balances = Balance.objects.select_related('user').values('user__username', 'amount')
    items = MenuItem.objects.values('name', 'times_bought')

    return Response({
        "balances": list(balances),
        "items": list(items)
    })
