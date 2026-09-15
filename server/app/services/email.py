import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr

# Attempt to load SMTP credentials from environment variables
SMTP_SERVER = os.environ.get("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
SMTP_USERNAME = os.environ.get("SMTP_USERNAME", "mishakiofficial109@gmail.com")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
FROM_EMAIL = os.environ.get("FROM_EMAIL", SMTP_USERNAME)

conf = ConnectionConfig(
    MAIL_USERNAME=SMTP_USERNAME,
    MAIL_PASSWORD=SMTP_PASSWORD,
    MAIL_FROM=FROM_EMAIL,
    MAIL_PORT=SMTP_PORT,
    MAIL_SERVER=SMTP_SERVER,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=False
)

async def send_custom_order_email(email_to: EmailStr, subject: str, body: str):
    """
    Sends a custom email.
    If SMTP credentials are not set, simulates sending by printing to console.
    """
    if not SMTP_PASSWORD:
        print(f"--- SIMULATED EMAIL ---")
        print(f"To: {email_to}")
        print(f"Subject: {subject}")
        print(f"Body:\n{body}")
        print(f"-----------------------")
        return

    html_body = f"""
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #7f1d1d; padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 2px;">MISHAKI</h1>
        </div>
        <div style="padding: 40px 30px; background-color: #ffffff; line-height: 1.8; font-size: 16px;">
            {body.replace(chr(10), '<br>')}
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb;">
            &copy; {__import__('datetime').datetime.now().year} Mishaki. All rights reserved.<br>
            <span style="font-size: 11px;">This is an automated confirmation message.</span>
        </div>
    </div>
    """

    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        body=html_body,
        subtype=MessageType.html
    )

    try:
        fm = FastMail(conf)
        await fm.send_message(message)
        print(f"Custom email successfully sent to {email_to}")
    except Exception as e:
        print(f"Failed to send email to {email_to}: {e}")
        raise e
