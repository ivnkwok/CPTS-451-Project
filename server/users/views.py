from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Balance
from .serializers import BalanceSerializer
from django.http import Http404
from decimal import Decimal
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse

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
