from django.urls import path
from .views import StudentBalanceView, OwnBalanceView

urlpatterns = [
    path('balance/<str:student_id>/', StudentBalanceView.as_view(), name='student-balance'),
    path('balance/', OwnBalanceView.as_view(), name='own-balance'),
] 