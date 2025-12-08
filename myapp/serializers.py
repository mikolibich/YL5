from rest_framework import serializers
from .models import Venue, EventTag, Event, User, Registration, VenueTag
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer 

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['phone_number'] = user.phone_number
        token['is_staff'] = user.is_staff

        return token

# Venue Serializer
class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = [
            "id",
            "name",
            "state",
            "city",
            "postcode",
            "max_capacity",
        ]


# EventTag Serializer
class EventTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventTag
        fields = ["id", "name"]

# VenueTag Serializer
class VenueTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueTag
        fields = ["id", "name"]


# Event Serializer
class EventSerializer(serializers.ModelSerializer):
    event_type = EventTagSerializer(read_only=True)
    venue = VenueSerializer(read_only=True)

    class Meta:
        model = Event
        fields = [
            "event_id",
            "title",
            "description",
            "event_type",
            "venue",
            "start_datetime",
            "end_datetime",
            "event_capacity",
            "image",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [ "created_at",
        "updated_at",]

        extra_kwargs = {"venue": {"read_only": True}}


# Attendee Serializer
class UserSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "phone_number",
            "dob",
            "notes",
        ]


# Registration Serializer
class RegistrationSerializer(serializers.ModelSerializer):
    attendee = UserSerializer(read_only=True)
    event = EventSerializer(read_only=True)

    class Meta:
        model = Registration
        fields = [
            "id",
            "attendee",
            "event",
            "status",
            "notes",
            "created_at",
        ]
        read_only_fields = ["created_at"]
        extra_kwargs = {"attendee": {"read_only": True},
                       "event": {"read_only": True}}
