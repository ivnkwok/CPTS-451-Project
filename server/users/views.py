# server/users/views.py

from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Balance
from .serializers import BalanceSerializer
from django.http import Http404, JsonResponse
from decimal import Decimal
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from menu.models import MenuItem as MenuItemModel

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'message': 'CSRF cookie set'})

class BalanceDetailView(generics.RetrieveAPIView):
    queryset = Balance.objects.all()
    serializer_class = BalanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        balance, created = Balance.objects.get_or_create(
            user=self.request.user,
            defaults={"amount": 0.00}
        )
        return balance

class BalanceTopUpView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            amount = Decimal(request.data.get("amount"))
            if amount <= 0:
                return Response({"error": "Amount must be positive"}, status=status.HTTP_400_BAD_REQUEST)

            balance, created = Balance.objects.get_or_create(user=request.user)
            balance.amount += amount
            balance.save()

            return Response({
                "message": "Balance updated",
                "new_balance": str(balance.amount)
            }, status=status.HTTP_200_OK)

        except (TypeError, ValueError):
            return Response({"error": "Invalid amount"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def purchase_item(request):
    try:
        item_id = request.data.get('itemId')
        if not item_id:
            return Response({'error': 'Item ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        item = MenuItemModel.objects.get(id=item_id)
        balance = Balance.objects.get(user=request.user)

        if balance.amount < item.price:
            return Response({'error': 'Insufficient balance.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Subtract price and save
        balance.amount -= item.price
        balance.save()

        # Increment item's times_bought
        item.times_bought += 1
        item.save()

        return Response({'message': 'Purchase successful', 'new_balance': balance.amount}, status=status.HTTP_200_OK)

    except MenuItemModel.DoesNotExist:
        return Response({'error': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Balance.DoesNotExist:
        return Response({'error': 'Balance not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
