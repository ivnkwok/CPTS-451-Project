# server/users/models.py

from django.contrib.auth.models import User
from django.db import models

class Balance(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.user.username} - ${self.amount:.2f}"
