from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = (
            "id",
            "code",
            "host",
            "guest_can_pause",
            "votes_to_skip",
            "created_at",
        )


class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        # Takes a simple request object and serializes incoming serialization
        fields = ("guest_can_pause", "votes_to_skip")


class UpdateRoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField(required=True)  # Make sure this is set

    class Meta:
        model = Room
        fields = ("guest_can_pause", "votes_to_skip", "code")
