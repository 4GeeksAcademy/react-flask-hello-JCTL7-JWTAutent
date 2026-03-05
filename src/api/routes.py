from .external_api import search_exercises
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)

from .models import db, User, Routine, Goal, TrainingLog
from .utils import validate_password

api = Blueprint("api", __name__)

# =========================================
# AUTH - SIGNUP
# =========================================


@api.route("/signup", methods=["POST"])
def signup():

    body = request.get_json()

    if not body or not body.get("email") or not body.get("password"):
        return jsonify({"msg": "Datos incompletos"}), 400

    if not validate_password(body["password"]):
        return jsonify({"msg": "Contraseña insegura"}), 400

    if User.query.filter_by(email=body["email"]).first():
        return jsonify({"msg": "El correo ya existe"}), 400

    user = User(
        email=body["email"],
        is_verified=True
    )

    user.set_password(body["password"])

    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado correctamente"}), 201


# =========================================
# AUTH - LOGIN
# =========================================

@api.route("/login", methods=["POST"])
def login():

    body = request.get_json()

    user = User.query.filter_by(email=body.get("email")).first()

    if not user or not user.check_password(body.get("password")):
        return jsonify({"msg": "Credenciales incorrectas"}), 401

    if not user.is_verified:
        return jsonify({"msg": "Debes verificar tu correo"}), 403

    token = create_access_token(identity=str(user.id))

    return jsonify({
        "token": token,
        "user": user.serialize()
    }), 200


# =========================================
# ROUTINES
# =========================================

@api.route("/routines", methods=["GET"])
def get_routines():

    search = request.args.get("search")

    if search:
        routines = Routine.query.filter(
            Routine.title.ilike(f"%{search}%")
        ).all()
    else:
        routines = Routine.query.filter_by(is_public=True).all()

    return jsonify([r.serialize() for r in routines]), 200


@api.route("/routines", methods=["POST"])
@jwt_required()
def create_routine():

    user_id = int(get_jwt_identity())

    body = request.get_json()

    if not body or not body.get("title") or not body.get("description"):
        return jsonify({"msg": "Título y descripción requeridos"}), 400

    routine = Routine(
        title=body["title"],
        description=body["description"],
        difficulty=body.get("difficulty"),
        style=body.get("style"),
        created_by=user_id
    )

    db.session.add(routine)
    db.session.commit()

    return jsonify(routine.serialize()), 201


# =========================================
# COMPLETE ROUTINE
# =========================================

@api.route("/routines/<int:routine_id>/complete", methods=["POST"])
@jwt_required()
def complete_routine(routine_id):

    user_id = int(get_jwt_identity())

    routine = Routine.query.get(routine_id)
    if not routine:
        return jsonify({"msg": "Rutina no encontrada"}), 404

    # evitar duplicados
    existing = TrainingLog.query.filter_by(
        user_id=user_id,
        routine_id=routine_id
    ).first()

    if existing:
        return jsonify({"msg": "Rutina ya completada"}), 400

    log = TrainingLog(
        user_id=user_id,
        routine_id=routine_id
    )

    db.session.add(log)

    user = User.query.get(user_id)
    user.points += 10

    db.session.commit()

    return jsonify({
        "msg": "Rutina completada",
        "points_earned": 10,
        "total_points": user.points
    }), 200


# =========================================
# TRAINING LOG
# =========================================

@api.route("/training-log", methods=["GET"])
@jwt_required()
def get_training_log():

    user_id = int(get_jwt_identity())

    logs = TrainingLog.query.filter_by(user_id=user_id).all()

    return jsonify([l.serialize() for l in logs]), 200


# =========================================
# GOALS
# =========================================

@api.route("/goals", methods=["POST"])
@jwt_required()
def create_goal():

    user_id = int(get_jwt_identity())

    body = request.get_json()

    goal = Goal(
        title=body["title"],
        target=body["target"],
        user_id=user_id
    )

    db.session.add(goal)
    db.session.commit()

    return jsonify(goal.serialize()), 201


@api.route("/goals", methods=["GET"])
@jwt_required()
def get_goals():

    user_id = int(get_jwt_identity())

    goals = Goal.query.filter_by(user_id=user_id).all()

    return jsonify([g.serialize() for g in goals]), 200


# =========================================
# DASHBOARD
# =========================================

@api.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():

    user_id = int(get_jwt_identity())

    user = User.query.get(user_id)

    total_routines = Routine.query.filter_by(created_by=user_id).count()
    total_training = TrainingLog.query.filter_by(user_id=user_id).count()
    active_goals = Goal.query.filter_by(
        user_id=user_id, completed=False).count()

    last_logs = (
        TrainingLog.query
        .filter_by(user_id=user_id)
        .order_by(TrainingLog.completed_at.desc())
        .limit(5)
        .all()
    )

    return jsonify({
        "user": user.serialize(),
        "stats": {
            "total_routines": total_routines,
            "total_training": total_training,
            "active_goals": active_goals
        },
        "last_training": [log.serialize() for log in last_logs]
    }), 200

# =========================================
# EXTERNAL EXERCISES
# =========================================


@api.route("/exercises", methods=["GET"])
def get_exercises():

    query = request.args.get("search", "chest")

    exercises = search_exercises(query)

    return jsonify(exercises), 200
