<<<<<<< Updated upstream
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MenuItemViewSet

router = DefaultRouter()
router.register(r'items', MenuItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 
=======
from django.urls import path
from .views import MenuItemCreateView, MenuItemListView, MenuItemDeleteView

urlpatterns = [
    path('create/', MenuItemCreateView.as_view(), name='create_menu_item'),
    path('list/', MenuItemListView.as_view(), name='list_menu_items'),
    path('delete/<int:pk>/', MenuItemDeleteView.as_view(), name='delete_menu_item'),
]
>>>>>>> Stashed changes
