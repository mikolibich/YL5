from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta

from ...models import Event, Registration 
from ...utils import send_whatsapp_message


class Command(BaseCommand):
    help = "Send WhatsApp reminders to users 1 hour before their event."

    def handle(self, *args, **options):
        now = timezone.now()

        # We look for events starting between 60 and 61 minutes from now,
        window_start = now + timedelta(minutes=60)
        window_end = now + timedelta(minutes=61)

        #generate queryset which adheres to the notification settings
        events = Event.objects.filter(
            start_datetime__gte=window_start,
            start_datetime__lt=window_end,
        )

        self.stdout.write(f"Found {events.count()} events in reminder window.")

        for event in events:
            registrations = Registration.objects.filter(event=event)

            for reg in registrations.select_related("user"):
                user = reg.user

                # Adjust attribute names to your actual User model
                phone_number = getattr(user, "phone_number", None)
                wants_notifications = getattr(user, "wants_whatsapp_notifications", True)

                if not phone_number or not wants_notifications:
                    continue

                msg = (
                    f"Reminder: Your event '{event.title}' starts at "
                    f"{event.start_datetime.strftime('%d %b %Y, %H:%M')}."
                )

                try:
                    send_whatsapp_message(phone_number, msg)
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"Sent reminder to {user} for event {event.id}"
                        )
                    )
                except Exception as e:
                    self.stderr.write(
                        f"Failed to send reminder to {user} ({phone_number}): {e}"
                    )