from itsdangerous import URLSafeTimedSerializer
from flask import current_app

def generate_token(email):
    serializer = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
    return serializer.dumps(email, salt="email-confirm")

def confirm_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
    return serializer.loads(
        token,
        salt="email-confirm",
        max_age=expiration
    )