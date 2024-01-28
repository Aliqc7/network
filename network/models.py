from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    followers = models.ManyToManyField("self", symmetrical=False, related_name="following", blank=True)

    def serialize(self):
        return {
            "username": self.username,
            "followers": [follower.username for follower in self.followers.all()],
            "following": [following.username for following in self.following.all()]
        }


class Post(models.Model):
    user = models.ForeignKey("User", on_delete = models.CASCADE, related_name = "posts")
    timestamp = models.DateTimeField()
    text = models.TextField()

    def __str__(self):
        return f"{self.user.username} - {self.timestamp} - {self.text}"
    
    def serialize(self):
        likes = self.likes.all().count()
        liked_usernames = [like.user.username for like in self.likes.all()]
        return {
            "user": self.user.username,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "text": self.text,
            "likes": likes,
            "liked_usernames": liked_usernames,
            "id": self.id
        }

class Like(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="likes")
    post = models.ForeignKey("Post", on_delete=models.CASCADE, related_name="likes")

    def __str__(self):
        return f"{self.user} likes {self.post}"
