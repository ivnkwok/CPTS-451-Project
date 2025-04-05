from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Balance
from .serializers import BalanceSerializer
from django.http import Http404

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