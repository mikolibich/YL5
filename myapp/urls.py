from django.urls import path
from . import views 
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [

    # User Endpoints
    path('users/<int:pk>/', views.UserView.as_view(), name='user-instance'),  # Single user details

    # Events
    path('events/', views.AllEventView.as_view(), name='event-list'),  # List all events
    path('events/<int:pk>/', views.EventView.as_view(), name='event-instance'),  # Single event details

    # Venues
    path('venues/', views.AllVenueView.as_view(), name='venue-list'),  # List all venues
    path('venues/<int:pk>/', views.VenueView.as_view(), name='venue-instance'),  # Single venue details

    # Event Tags
    path('event-tags/', views.AllEventTagView.as_view(), name='event-tag-list'),  # List all event tags
    path('event-tags/<int:pk>/', views.EventTagView.as_view(), name='event-tag-instance'),  # Single event tag details

    # Venue Tags
    path('venue-tags/', views.AllVenueTagView.as_view(), name='venue-tags-list'),  # List all venue tags
    path('venue-tags/<int:pk>/', views.VenueTagView.as_view(), name='venue-tags-instance'),  # Single venue tag details
    
    # Registration 
    path('registrations/', views.AllRegistrationView.as_view(), name='registration-list'),  # List all registrations associated with user
    path('registrations/<int:pk>/', views.RegistrationView.as_view(), name='registration-instance'),  # Single registration instance details
    
]

# Allow the URLs to have suffixes like .json or .html to specify output type
urlpatterns = format_suffix_patterns(urlpatterns)
