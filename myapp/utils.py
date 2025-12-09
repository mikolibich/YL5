# utils.py
from django.conf import settings
from twilio.rest import Client
from enum import Enum
import phonenumbers 


def format_phone_number(phone_number: str, country_code: str = "GB"):  # Would be 'MY' if it were in Malaysia
    """
    Returns the phone number in an appropriate format for the twilio function
    
    :param phone_number: Description
    :type phone_number: str

    """
    number = phonenumbers.parse(phone_number, country_code)
    return phonenumbers.format_number(number, phonenumbers.PhoneNumberFormat.E164)


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
