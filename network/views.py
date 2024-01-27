import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from django.core.paginator import Paginator

from .models import User, Post


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@login_required
@csrf_exempt

# TODO: Configure csrf

def new_post(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    else:
        data = json.loads(request.body)
        text = data.get("text", "")
        timestamp = datetime.now()

        new_post = Post.objects.create(user = request.user, text = text, timestamp = timestamp)
        new_post.save()
        return JsonResponse({"message": "Post Submitted Successfully."}, status=201)



@login_required
# @csrf_exempt ### There is not need for this as we are not posting anything. 
def show_all_posts(request, page_number):
    posts = Post.objects.all().order_by("timestamp")
    paginator = Paginator(posts, 10)
    last_page = paginator.num_pages
    page_object = paginator.get_page(page_number) 
    serial_posts = [post.serialize() for post in page_object.object_list]
    
    return JsonResponse({
        "posts": serial_posts,
        "page_number": page_number,
        "last_page": last_page
    }, safe=False)

@login_required
def show_user(request, username):
    user = User.objects.get(username = username)
    return JsonResponse(user.serialize())

@login_required
def show_user_posts(request, username):
    user = User.objects.get(username = username)
    posts = Post.objects.filter(user = user).order_by("timestamp")
    return JsonResponse([post.serialize() for post in posts], safe=False)

def get_username(request):

    username = request.user.username
    return JsonResponse({
        "username": username
    })

@csrf_exempt
@login_required
def follow_user(request, username):
    if request.method == "PUT":
        user = User.objects.get(username = username)
        following_user = request.user
        is_follower = user.followers.filter(pk=following_user.pk).exists()
        if not is_follower:
            user.followers.add(following_user)
            message = "User followed successfully!"
        else:
            user.followers.remove(following_user)
            message = "User unfollowed successfully!"

        user.save()
        return JsonResponse({
            "message": message
        }, status=200)
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)

@login_required
def show_following_posts(request, username):
    user = User.objects.get(username = username)
    following = user.following.all()
    posts = Post.objects.filter(user__in=following).order_by("timestamp")
    return JsonResponse([post.serialize() for post in posts], safe=False)
