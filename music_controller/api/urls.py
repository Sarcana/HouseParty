from django.urls import path
from api.views import (
    RoomView,
    CreateRoomView,
    getRoom,
    JoinRoom,
    UserinRoom,
    LeaveRoom,
    UpdateRoom,
    DeleteRoom,
)

urlpatterns = [
    path("room/", RoomView.as_view(), name="RoomView"),
    path("create-room", CreateRoomView.as_view()),
    path("get-room", getRoom.as_view()),
    path("join-room", JoinRoom.as_view()),
    path("user-in-room", UserinRoom.as_view()),
    path("leave-room", LeaveRoom.as_view()),
    path("update-room", UpdateRoom.as_view()),
    path("delete-room", DeleteRoom.as_view()),
]
