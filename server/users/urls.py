from django.urls import path
from .views import BalanceDetailView

urlpatterns = [
    path('balance/', BalanceDetailView.as_view(), name='user-balance'),
]
