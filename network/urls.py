
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("new_post", views.new_post, name="new_post"),
    path("show_all_posts", views.show_all_posts, name="show_all_posts"),
    path("show_user/<str:username>", views.show_user, name="show_user"),
    path("show_user_posts/<str:username>", views.show_user_posts, name="show_user_posts"),
    path("get_username", views.get_username, name="get_username"),
    path("follow_user/<str:username>", views.follow_user, name="follow_user"),
    path("show_following_posts/<str:username>", views.show_following_posts, name="show_following_posts")
]
