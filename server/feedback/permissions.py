from rest_framework.permissions import BasePermission

class IsStaffOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and 
            (request.user.is_staff or request.user.groups.filter(name='admin').exists())
        )
