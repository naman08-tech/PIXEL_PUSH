from crewai.tools import BaseTool
from twilio.rest import Client
import os

class EmergencyNotificationTool(BaseTool):
    name: str = "emergency_notification_tool"
    description: str = "Calls and messages a pre-set emergency contact with the user's location."

    def _run(self, latitude: str, longitude: str, health_summary: str) -> str:
        account_sid = ''
        auth_token = ''
        twilio_number = ''
        target_phone = ''

        client = Client(account_sid, auth_token)

        maps_link = f"https://www.google.com/maps?q={latitude},{longitude}"
        message_body = f"EMERGENCY ALERT: {health_summary}. Location: {maps_link}"

        try:
            client.messages.create(body=message_body, from_=twilio_number, to=target_phone)

            client.calls.create(
                twiml=f'<Response><Say voice="alice">Emergency alert. Please check your messages for a location link regarding a health crisis.</Say></Response>',
                from_=twilio_number,
                to=target_phone
            )
            return f"Successfully notified {target_phone} via Call and SMS."
        except Exception as e:
            return f"Notification failed: {str(e)}"