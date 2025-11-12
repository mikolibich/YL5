from django.contrib import admin
from .models import *
from django.utils import timezone
from datetime import date
from django.utils.html import mark_safe
from django.db import models
import re
from django.shortcuts import render
from django.urls import path
from django.conf import settings
from datetime import datetime
from django.contrib.auth import get_user_model
User = get_user_model()

# Admin design

class ROSEStaffAdminArea(admin.AdminSite):
    site_header = 'ROSE Staff Dashboard'

ROSE_staff_portal = ROSEStaffAdminArea(name="Master Login portal name")


class VenueAdmin(admin.ModelAdmin):
    list_display = ["name", "address", "city", "postcode", "max_capacity"]
    list_filter = ["city"]
    search_fields = ["name"]
    exclude = []

class EventTagAdmin(admin.ModelAdmin):
    list_display = ["name"]
    search_fields = ["name"]
    exclude = []

class EventAdmin(admin.ModelAdmin):
    list_display = ["title", "event_type", "venue", "start_datetime", "image", "event_capacity", "status"]
    list_filter = ["event_type", "status"]
    search_fields = ["title"]
    readonly_fields = ('created_at', 'updated_at')
    exclude = ["slug",]

class RegistrationAdmin(admin.ModelAdmin):
    list_display = ["attendee", "event", "status", "created_at"]
    list_filter = ["event", "status"]
    search_fields = ["attendee__name"]
    exclude = []
    readonly_fields = ('created_at',)

class AttendeeAdmin(admin.ModelAdmin):
    list_display = ("user", "phone_number", "created_at")
    search_fields = ("user__username", "phone_number")
    readonly_fields = ("created_at", "updated_at")
    list_filter = ("created_at",)

ROSE_staff_portal.register(User)
ROSE_staff_portal.register(Venue, VenueAdmin)
ROSE_staff_portal.register(EventTag, EventTagAdmin)
ROSE_staff_portal.register(Event, EventAdmin)
ROSE_staff_portal.register(Registration, RegistrationAdmin)
ROSE_staff_portal.register(Attendee, AttendeeAdmin)
