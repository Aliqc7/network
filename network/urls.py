
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("new_post", views.new_post, name="new_post"),
    path("show_posts/<str:username>/<str:posts_to_show>/<int:page_number>", views.show_posts, name="show_posts"),
    path("show_user/<str:username>", views.show_user, name="show_user"),
    path("get_username", views.get_username, name="get_username"),
    path("follow_user/<str:username>", views.follow_user, name="follow_user")
]
