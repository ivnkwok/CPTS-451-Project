from functools import wraps
from django.http import JsonResponse
from rest_framework import status

def require_permission(permission_code):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return JsonResponse(
                    {'error': 'Authentication required'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            if not hasattr(request.user, 'profile'):
                return JsonResponse(
                    {'error': 'User profile not found'},
                    status=status.HTTP_403_FORBIDDEN
                )

            if not request.user.profile.has_permission(permission_code):
                return JsonResponse(
                    {'error': 'Permission denied'},
                    status=status.HTTP_403_FORBIDDEN
                )

            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator 