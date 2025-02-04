from django.urls import path
from .views import index

app_name = "frontend"

urlpatterns = [
    # Intentionally left blank so spotify_callback redirect successfully works
    path("", index, name=""),
    path("join/", index),
    path("create/", index),
    path("room/<str:roomCode>", index),
]
