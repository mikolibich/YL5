# utils.py
from django.conf import settings
from twilio.rest import Client
from enum import Enum
import phonenumbers 


def format_phone_number(phone_number: str, country_code: str = "GB") -> str:
    """
    Normalises a phone number into E.164 format for Twilio WhatsApp.
    Accepts:
        - Local numbers (e.g. "07123456789")
        - International numbers (e.g. "+447123456789")
    """

    # If number already starts with +, assume it's complete
    if phone_number.startswith("+"):
        try:
            parsed = phonenumbers.parse(phone_number)
        except Exception:
            raise ValueError("Invalid phone number format.")
        return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)

    # Otherwise parse using the supplied country code (default GB)
    try:
        parsed = phonenumbers.parse(phone_number, country_code)
    except Exception:
        raise ValueError("Invalid phone number format.")
    
    return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)


def send_whatsapp_message(to_number: str, body: str) -> None:
    """
    to_number must include country code, e.g. '+447123456789'
    """
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    formatted_number = format_phone_number(phone_number=to_number)

    client.messages.create(
        from_=f"whatsapp:{settings.TWILIO_WHATSAPP_FROM}",  # e.g. 'whatsapp:+14155238886'
        to=f"whatsapp:{formatted_number}",
        body=body,
    )
