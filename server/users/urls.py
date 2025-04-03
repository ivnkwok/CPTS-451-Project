from django.urls import path
from .views import UserBalanceView

urlpatterns = [
    path('balance/<str:student_id>/', UserBalanceView.as_view(), name='user-balance'),
] 