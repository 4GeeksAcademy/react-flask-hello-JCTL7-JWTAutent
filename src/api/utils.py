from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from functools import wraps
from .models import User
import re

# =========================
# PASSWORD VALIDATION
# =========================
def validate_password(password):
    # Mínimo 6 caracteres
    if len(password) < 6:
        return False

    # Debe contener al menos una letra
    if not re.search(r"[A-Za-z]", password):
        return False

    # Debe contener al menos un número
    if not re.search(r"[0-9]", password):
        return False

    return True


# =========================
# PREMIUM DECORATOR
# =========================
def premium_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role != "premium":
            return jsonify({"msg": "Premium access required"}), 403
        return fn(*args, **kwargs)
    return wrapper