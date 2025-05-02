# server/users/views.py
from django.shortcuts import render, get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Balance
from .serializers import BalanceSerializer
from django.http import Http404, JsonResponse
from decimal import Decimal
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from menu.models import MenuItem as MenuItemModel
from django.views.decorators.csrf import csrf_exempt 

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

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def purchase_item(request):
    print("RAW request.data:", request.data)
    try:
        item_id = request.data.get('item_id')
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


@permission_classes([IsAuthenticated])
def list_users_view(request):
    if request.method == "GET":
        users = User.objects.all()
        user_list = []
        for user in users:
            user_list.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
                "groups": list(user.groups.values_list('name', flat=True)),
            })
        return JsonResponse({"users":user_list})
    else:
        return JsonResponse({"error":"Method not allowed"}, status=405)

@csrf_exempt
def delete_user_view(request, id):
    if request.method == "DELETE":
        try:
            user_to_delete = get_object_or_404(User, pk=id)
            if user_to_delete == request.user:
                return JsonResponse({"error": "You cannot delete your own account."}, status=403);
            user_to_delete.delete();
            return JsonResponse({"message": f"User {id} deleted successfully."})
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=403)
