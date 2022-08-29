from django.contrib import admin
from django.urls import path
from .views import RoomView, CreateRoomView, GetRoom

urlpatterns = [
    path('get-all-rooms', RoomView.as_view()),
    path('create-room', CreateRoomView.as_view()),
    path('room', GetRoom.as_view())
]
