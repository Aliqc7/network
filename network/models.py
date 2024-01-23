from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "posts")
    timestamp = models.DateTimeField()
    text = models.TextField()

    def __str__(self):
        return f"{self.user.username} - {self.timestamp} - {self.text}"
    
    def serialize(self):
        return {
            "user": self.user.username,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "text": self.text
        }