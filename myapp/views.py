from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework.generics import (RetrieveUpdateDestroyAPIView, ListAPIView,
CreateAPIView, DestroyAPIView, ListCreateAPIView, RetrieveAPIView, )
from rest_framework.permissions import IsAuthenticated, AllowAny,IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserView(RetrieveAPIView):
    """
    Class for getting the user instance of the user logged in
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)


class EventView(RetrieveAPIView):
    """
    Class for GET methods of the singular event endpoint
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]
    

class AllEventView(ListAPIView):
    """
    Class for getting all results from the event endpoint
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['event_type', 'venue',
                        'status',]  # Fields you want to filter by
    search_fields = ['title',]
    ordering_fields = ['event_capacity', '-start_datetime']


class CreateUserView(CreateAPIView):
    """
    Class for accessing the users/register endpoint and being able to create a user
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer #expects properties from the User Model
    permission_classes = [AllowAny]


class VenueView(RetrieveAPIView): 
    """
    Class View for GET methods for the singular venue endpoint
    """
    queryset = Venue.objects.all()
    serializer_class = VenueSerializer
    permission_classes = [IsAdminUser]


class AllVenueView(ListAPIView):
    """
    Class View for getting all instances of the venues
    """
    queryset = Venue.objects.all()
    serializer_class = VenueSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['city']
    search_fields = ['name', 'address', 'postcode']
    ordering_fields = ['-max_capacity']

class AllVenueTagView(ListAPIView): 
    """
    Class View for getting all venue tag instances
    """
    queryset = VenueTag.objects.all()
    serializer_class = VenueTagSerializer
    permission_classes = [AllowAny]

class VenueTagView(RetrieveAPIView): 
    """
    Class View for GET method for the singular venue tag endpoint
    """
    queryset = VenueTag.objects.all()
    serializer_class = VenueTagSerializer
    permission_classes = [AllowAny]


class AllEventTagView(ListAPIView): 
    """
    Class View for GET method for the all event tag instances
    """
    queryset = EventTag.objects.all()
    serializer_class = EventTagSerializer
    permission_classes = [AllowAny]


class EventTagView(RetrieveAPIView): 
    """
    Class View for GET method for the singular event tag endpoint
    """
    queryset = EventTag.objects.all()
    serializer_class = EventTagSerializer
    permission_classes = [AllowAny]


class AllRegistrationView(ListCreateAPIView): 
    """
    Class View for GET/POST methods for the singular registration endpoint
    """
    serializer_class = RegistrationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Registration.objects.filter(attendee=self.request.user)
    

class RegistrationView(RetrieveUpdateDestroyAPIView):
    """
    Class view for GET/UPDATE/DELETE methods for a singular registration
    """

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['attendee', 'event']
    ordering_fields = ['-created_at']

    def get_queryset(self):
        return Registration.objects.filter(attendee=self.request.user)
