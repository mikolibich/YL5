from django.contrib import admin
from .models import *
from django.utils import timezone
from datetime import date
from django.utils.html import mark_safe
from django.db import models
from django.shortcuts import render
from django.urls import path
from django.conf import settings
from datetime import datetime
from django.utils.translation import gettext_lazy as _
from django.contrib.admin import SimpleListFilter

# Admin design

class ROSEStaffAdminArea(admin.AdminSite):
    site_header = 'ROSE Staff Dashboard'

ROSE_staff_portal = ROSEStaffAdminArea(name="Master Login portal name")

# Actions

# Filters

class StatusFilter(SimpleListFilter):
    """
    Filter for determining status of the event
    """

    title = _('Status')
    parameter_name = 'status'

    def lookups(self, request, model_admin):
        return [
            ('UPCOMING', 'Upcoming'),
            ('ONGOING', 'Ongoing'),
            ('COMPLETED', 'Completed'),
        ]
    
    def queryset(self, request, queryset):
        value = self.value()
        if value == 'UPCOMING':
            return queryset.filter(start_datetime__gt=timezone.now())
        if value == 'ONGOING':
            now = timezone.now()
            return queryset.filter(start_datetime__lte=now, end_datetime__gte=now)
        if value == 'COMPLETED':
            return queryset.filter(end_datetime__lt=timezone.now())
        return queryset

class VenueAdmin(admin.ModelAdmin):
    list_display = ["name", "address", "state", "postcode", "max_capacity"]
    list_filter = ["state"]
    search_fields = ["name"]
    exclude = []

class EventTagAdmin(admin.ModelAdmin):
    list_display = ["name"]
    search_fields = ["name"]
    exclude = []

class VenueTagAdmin(admin.ModelAdmin):
    list_display = ["name"]
    search_fields = ["name"]
    exclude = []

class EventAdmin(admin.ModelAdmin):
    list_display = ["title", "event_type", "venue", "start_datetime", "image_preview", "event_capacity", "status"]
    list_filter = ["event_type", StatusFilter]
    search_fields = ["title"]
    readonly_fields = ('created_at', 'updated_at')
    exclude = ["slug",]

    def image_preview(self, obj):
        """
        Returns an HTML image tag to display the image preview in the admin.
        """
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="120" height="60" style="object-fit:cover;"/>')
        return mark_safe(f'<img src="/static/placeholder.png" width="120" height="60" style="object-fit:cover;"/>')
    
    image_preview.short_description = "Thumbnail Image"


class RegistrationAdmin(admin.ModelAdmin):
    list_display = ["attendee", "event", "status", "created_at"]
    list_filter = ["event", 'status']
    search_fields = ["attendee__name"]
    exclude = []
    readonly_fields = ('created_at',)

class AttendeeAdmin(admin.ModelAdmin):
    list_display = ("user", "phone_number", "dob","created_at")
    search_fields = ("user__username", "phone_number")
    readonly_fields = ("created_at", "updated_at")
    list_filter = ("created_at",)

ROSE_staff_portal.register(User)
ROSE_staff_portal.register(Venue, VenueAdmin)
ROSE_staff_portal.register(VenueTag, VenueTagAdmin)
ROSE_staff_portal.register(EventTag, EventTagAdmin)
ROSE_staff_portal.register(Event, EventAdmin)
ROSE_staff_portal.register(Registration, RegistrationAdmin)
