# Create your models here

from django.db import models
import os
from django.core.files.storage import default_storage
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.contrib import messages
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from .managers import UserManager

# Validators

postcode_validator = RegexValidator(
    regex=r'^\d{5}$',
    message="Enter a valid Malysian postcode"
)

class VenueTag(models.Model):
    """
    Tags for the Venue to ensure those with special requirements
    are aware of the Venue's features.
    """
    
    name = models.CharField(max_length=60, unique=True)

    def __str__(self):
        return self.name
    
class Venue(models.Model):

    """
    Venue/location for events
    """
    name = models.CharField(max_length=60)
    address = models.CharField(max_length=60)
    venue_feature = models.ForeignKey(VenueTag, on_delete=models.SET_NULL,
                                       null = True, related_name="venues",
                                       verbose_name="Venue Tag")
    state = models.CharField(max_length=20)
    postcode = models.CharField(max_length=5,
                                 validators=[postcode_validator], help_text="Format: 12345")
    max_capacity = models.PositiveIntegerField(default=0,
                                            help_text="Maximum people allowed at the venue")
    class Meta:
        verbose_name = "Venue"
        verbose_name_plural = "Venues"
        indexes = [
            models.Index(fields=['state']),
            models.Index(fields=['name']),
        ]

    def __str__(self):
        return f"{self.name} - {self.state}" if self.state else self.name

    

class EventTag(models.Model):
    """
    Tags for the events to ensure the correct audience is targetted
    """
    
    name = models.CharField(max_length=60, unique=True)

    def __str__(self):
        return self.name


class Event(models.Model):
    """
    Main event model
    """

    #status choices
    UPCOMING = 'Upcoming'
    ONGOING = 'Ongoing'
    COMPLETED = 'Completed'

    event_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    event_type = models.ForeignKey(EventTag, on_delete=models.SET_NULL, null = True, related_name="events")
    venue = models.ForeignKey(Venue, on_delete=models.SET_NULL, null = True, related_name="events")
    start_datetime = models.DateTimeField(verbose_name = 'Start Time', help_text="Will be truncated to the nearest 5 minute interval")
    end_datetime = models.DateTimeField(verbose_name = 'End Time', help_text="Will be truncated to the nearest 5 minute interval")
    event_capacity = models.PositiveIntegerField(help_text="Will be limited to the max venue capacity")
    image = models.ImageField(upload_to="media/event_images", blank=True, verbose_name="Event Image")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Event"
        verbose_name_plural = "Events"
        indexes = [
            models.Index(fields=['start_datetime']),
            models.Index(fields=['event_type']),
            models.Index(fields=['venue']),
        ]
        ordering = ['-start_datetime']

    def __str__(self):
        return f"{self.title} ({self.venue})"
    
    def clean(self):

        # Ensure that the capacity does not exceed venue capacity
        if self.event_capacity > self.venue.max_capacity:
            self.event_capacity = self.venue.max_capacity
 
        # Ensure that the seconds are truncated
        if self.start_datetime:
            self.start_datetime = self.start_datetime.replace(
                second=0,
                microsecond=0)

        if self.end_datetime:
            self.end_datetime = self.end_datetime.replace(
                second=0,
                microsecond=0)

        if self.created_at:
            self.created_at = self.created_at.replace(
                second=0, microsecond=0)

        if self.updated_at:
            self.updated_at = self.updated_at.replace(
                second=0,
                microsecond=0)
    
    def save(self, *args, **kwargs):
        # Auto generate slug if not provided
        if not self.slug:
            base = slugify(self.title)[:140]
            slug = base
            count = 1
            while Event.objects.filter(slug=slug).exists():
                slug = f"{base}-{count}"
                count += 1
            self.slug = slug

        self.full_clean()

        super().save(*args, **kwargs)

    def seats_available(self):
        """
        Helper Function
        Return how many seats remain (0 or positive).
        """
        cap = self.event_capacity
        if cap <= 0:
            return 0
        seats_taken = self.registered_attendees_count()
        remaining = cap - seats_taken
        return max(0, remaining)

    def registered_attendees_count(self):
        """
        Helper Function
        Returns the amount of attendees which are registered to the event
        """
        return self.registrations.filter(status=Registration.REGISTERED).count()

        
    def is_full(self):
        """True if no seats remain."""
        return self.seats_available() <= 0
    
    def is_complete(self):
        """Determines whether the end time has elapsed"""
        return self.end_datetime < timezone.now()
    
    def is_commencing(self):
        """Determines whether the event has started but not finished"""
        return self.start_datetime <= timezone.now() <= self.end_datetime
    
    def get_likes(self):
        return 
                  
    @property
    def status(self):
        if self.is_complete():
            return self.COMPLETED
        elif self.is_commencing():
            return self.ONGOING
        return self.UPCOMING

            
class User(AbstractUser):
    """
    Manual User accounts can be applied by administrators
    Model contains basic validation
    """

    # Remove username field
    username = None
    name = models.CharField(max_length=30, blank=True, null=True, help_text='First and Last Name')
    phone_number = models.CharField(max_length=11, blank = True, null = True, help_text='Used for login', unique=True)
    dob = models.DateField(verbose_name="Date of Birth", blank = True, null = True, help_text='Format "YYYY-MM-DD"')
    notes = models.TextField(blank=True, null = True, help_text="Optional notes about the User")
    
    USERNAME_FIELD = "phone_number"
    REQUIRED_FIELDS = []  # createsuperuser will only ask for phone + password

    def get_short_name(self):
        return self.name if self.name else 'Guest'
    
    objects = UserManager()

    def __str__(self):
        return f"{self.name} - {self.phone_number}" if self.name else f"{self.phone_number}"

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        indexes = [
            models.Index(fields=['phone_number']),
        ]
        unique_together = ('dob', 'phone_number')  # prevent duplicate users
        
    def save(self, *args, **kwargs):
        # run full_clean to ensure clean() is applied (callers can skip with clean=False if desired)
        self.full_clean()
        super().save(*args, **kwargs)

class Registration(models.Model):
    """
    Connects the user models to each event they would like to join
    """
    REGISTERED = 'RG'
    WAITLIST = 'WL'
    ATTENDEE_STATUS_CHOICES = [
        (REGISTERED, 'Registered'),
        (WAITLIST, 'Waitlist'),
    ]

    attendee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='registrations')
    event = models.ForeignKey('Event', on_delete=models.CASCADE, related_name='registrations')
    status = models.CharField(max_length=2, choices=ATTENDEE_STATUS_CHOICES, default=REGISTERED)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('attendee', 'event')

    def __str__(self):
        return f"{self.attendee} → {self.event})"

    def clean(self):
        print(self.event.is_full(), "EVENT FULL")
        if self.status == self.REGISTERED and self.event.is_full():
            self.status = self.WAITLIST
            raise ValidationError("Event is full, cannot register.")

class Likes(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, )
    event = models.ForeignKey(Event, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'event')