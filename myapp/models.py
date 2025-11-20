# Create your models here

from django.db import models
import os
from django.core.files.storage import default_storage
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser

class Venue(models.Model):

    """
    Venue/location for events
    """
    name = models.CharField(max_length=60)
    address = models.CharField(max_length=60, blank=True)
    city = models.CharField(max_length=60, blank=True)
    postcode = models.CharField(max_length=60, blank=True)
    max_capacity = models.PositiveIntegerField(default=0,
                                            help_text="Maximum people allowed at the venue")
    class Meta:
        verbose_name = "Venue"
        verbose_name_plural = "Venues"
        indexes = [
            models.Index(fields=['city']),
            models.Index(fields=['name']),
        ]

    def __str__(self):
        return f"{self.name} - {self.city}" if self.city else self.name
    

class EventTag(models.Model):
    """
    Tags for the events to ensure the correct audience is targetted
    """
    
    name = models.CharField(max_length=60, unique=True)

    def __str__(self):
        return self.name
    
class VenueTag(models.Model):
    """
    Tags for the Venue to ensure those with special requirements
    are aware of the Venue's features.
    """
    
    name = models.CharField(max_length=60, unique=True)

    def __str__(self):
        return self.name


class Event(models.Model):
    """
    Main event model
    """

    #status choices
    UPCOMING = 'UP'
    ONGOING = 'OG'
    COMPLETED = 'CP'
    CANCELLED = 'CC'

    STATUS_CHOICES = [
        (UPCOMING, 'Upcoming'),
        (ONGOING, 'Ongoing'),
        (COMPLETED, 'Completed'),
        (CANCELLED, 'Cancelled')
    ]

    event_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    event_type = models.ForeignKey(EventTag, on_delete=models.SET_DEFAULT, null = True, related_name="events", default = "Standard")
    venue = models.ForeignKey(Venue, on_delete=models.SET_NULL, null = True, related_name="events")
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField(blank=True, null=True)
    event_capacity = models.PositiveIntegerField(default = 0,
                                                  help_text="0 =  use the venue's default capacity")
    image = models.ImageField(upload_to="event_images", blank=True, verbose_name="Event Image")
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default=UPCOMING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Event"
        verbose_name_plural = "Events"
        indexes = [
            models.Index(fields=['start_datetime']),
            models.Index(fields=['status']),
            models.Index(fields=['event_type']),
            models.Index(fields=['venue']),
        ]
        ordering = ['-start_datetime']

    def __str__(self):
        return f"{self.title} ({self.venue})"
    
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

        super().save(*args, **kwargs)

    def seats_available(self):
        """Return how many seats remain (0 or positive)."""
        cap = self.venue.capacity
        if cap <= 0:
            return 0
        seats_taken = self.registered_attendees_count()
        remaining = cap - seats_taken
        return max(0, remaining)

    def is_full(self):
        """True if no seats remain."""
        return self.seats_available() <= 0
    
    def get_event_type_display(self):
        """
        Gets the event type from the other tag
        """

class User(AbstractUser):
    """
    Manual User accounts can be applied by administrators
    Model contains basic validation
    """

    phone_number = models.CharField(max_length=11)
    dob = models.DateField(verbose_name="Date of Birth")
    notes = models.TextField(blank=True, help_text="Optional notes about the User")


    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        indexes = [
            models.Index(fields=['phone_number']),
        ]
        unique_together = ('dob', 'phone_number')  # prevent duplicate users

    def __str__(self):
        return f"{self.username}"
    
    def clean(self):
        """
        Basic validation: if attempting to set status to REGISTERED while event is full,
        raise ValidationError. This enforces manual decision-making in admin/UI.
        """
        #if self.registration_status == self.REGISTERED and self.event.is_full():
        #   raise ValidationError("Event is full. Set status to WAITLISTED or cancel another registration first.")
        
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
    CANCELLED = 'CC'
    ATTENDEE_STATUS_CHOICES = [
        (REGISTERED, 'Registered'),
        (WAITLIST, 'Waitlist'),
        (CANCELLED, 'Cancelled'),
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
        if self.status == self.REGISTERED and self.event.is_full():
            raise ValidationError("Event is full, cannot register.")