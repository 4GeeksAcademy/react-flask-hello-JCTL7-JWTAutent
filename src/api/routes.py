from sqlalchemy import or_
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)

from .models import db, User, Routine, Goal, TrainingLog, Exercise, Reward, UserReward, RoutineExercise
from .utils import validate_password, premium_required
from .ai import generate_ai_routine

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
        return jsonify({"msg": "Contraseña insegura (mínimo 6 caracteres, alfanumérica)"}), 400

    if User.query.filter_by(email=body["email"]).first():
        return jsonify({"msg": "El correo ya existe"}), 400

    user = User(
        email=body["email"],
        is_verified=True  # Volvemos a poner True para evitar verificación
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
# PASSWORD RESET (simulado)
# =========================================
@api.route("/forgot-password", methods=["POST"])
def forgot_password():
    body = request.get_json()
    email = body.get("email")
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg": "Si el correo existe, recibirás instrucciones"}), 200
    return jsonify({"msg": "Correo de recuperación enviado (simulado)"}), 200


@api.route("/reset-password/<token>", methods=["POST"])
def reset_password(token):
    body = request.get_json()
    new_password = body.get("password")
    return jsonify({"msg": "Contraseña actualizada (simulado)"}), 200


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


@api.route("/routines/<int:routine_id>", methods=["GET"])
def get_routine(routine_id):
    routine = Routine.query.get(routine_id)
    if not routine:
        return jsonify({"msg": "Rutina no encontrada"}), 404
    return jsonify(routine.serialize()), 200


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

    existing = TrainingLog.query.filter_by(
        user_id=user_id, routine_id=routine_id
    ).first()
    if existing:
        return jsonify({"msg": "Rutina ya completada"}), 400

    log = TrainingLog(user_id=user_id, routine_id=routine_id)
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


@api.route("/goals/<int:goal_id>", methods=["PUT"])
@jwt_required()
def update_goal(goal_id):
    user_id = int(get_jwt_identity())
    goal = Goal.query.get(goal_id)
    if not goal or goal.user_id != user_id:
        return jsonify({"msg": "Meta no encontrada"}), 404

    body = request.get_json()
    if "title" in body:
        goal.title = body["title"]
    if "target" in body:
        goal.target = body["target"]
    if "progress" in body:
        goal.progress = body["progress"]
    if "completed" in body:
        goal.completed = body["completed"]

    db.session.commit()
    return jsonify(goal.serialize()), 200


@api.route("/goals/<int:goal_id>", methods=["DELETE"])
@jwt_required()
def delete_goal(goal_id):
    user_id = int(get_jwt_identity())
    goal = Goal.query.get(goal_id)
    if not goal or goal.user_id != user_id:
        return jsonify({"msg": "Meta no encontrada"}), 404

    db.session.delete(goal)
    db.session.commit()
    return jsonify({"msg": "Meta eliminada"}), 200


@api.route("/goals/<int:goal_id>/complete", methods=["PATCH"])
@jwt_required()
def complete_goal(goal_id):
    user_id = int(get_jwt_identity())
    goal = Goal.query.get(goal_id)
    if not goal or goal.user_id != user_id:
        return jsonify({"msg": "Meta no encontrada"}), 404

    goal.completed = True
    goal.progress = goal.target
    db.session.commit()
    return jsonify(goal.serialize()), 200


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
    active_goals = Goal.query.filter_by(user_id=user_id, completed=False).count()

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
# EXERCISES (desde BD)
# =========================================
@api.route("/exercises", methods=["GET"])
def get_exercises():
    query = request.args.get("search", "")
    exercises = Exercise.query
    if query:
        exercises = exercises.filter(
            or_(
                Exercise.name.ilike(f"%{query}%"),
                Exercise.muscle.ilike(f"%{query}%"),
                Exercise.type.ilike(f"%{query}%")
            )
        )
    exercises = exercises.limit(30).all()
    return jsonify([e.serialize() for e in exercises]), 200


@api.route('/exercises/<int:exercise_id>', methods=['GET'])
def get_exercise(exercise_id):
    exercise = Exercise.query.get(exercise_id)
    if not exercise:
        return jsonify({'msg': 'Ejercicio no encontrado'}), 404
    return jsonify(exercise.serialize()), 200


# =========================================
# REWARDS
# =========================================
@api.route("/rewards", methods=["GET"])
def get_rewards():
    rewards = Reward.query.all()
    return jsonify([r.serialize() for r in rewards]), 200


@api.route("/rewards/claim/<int:reward_id>", methods=["POST"])
@jwt_required()
def claim_reward(reward_id):
    user_id = int(get_jwt_identity())
    reward = Reward.query.get(reward_id)
    if not reward:
        return jsonify({"msg": "Recompensa no encontrada"}), 404

    user = User.query.get(user_id)
    if user.points < reward.cost:
        return jsonify({"msg": "Puntos insuficientes"}), 400

    existing = UserReward.query.filter_by(user_id=user_id, reward_id=reward_id).first()
    if existing:
        return jsonify({"msg": "Ya has reclamado esta recompensa"}), 400

    user_reward = UserReward(user_id=user_id, reward_id=reward_id, claimed=True)
    user.points -= reward.cost
    db.session.add(user_reward)
    db.session.commit()

    return jsonify({
        "msg": "Recompensa reclamada",
        "points_left": user.points
    }), 200


# =========================================
# PREMIUM CONTENT (ejemplo)
# =========================================
@api.route("/premium/diets", methods=["GET"])
@jwt_required()
@premium_required
def get_premium_diets():
    diets = [
        {"name": "Dieta cetogénica", "description": "Alta en grasas, baja en carbohidratos"},
        {"name": "Dieta volumen", "description": "Superávit calórico para ganar masa muscular"},
    ]
    return jsonify(diets), 200


# =========================================
# EXTERNAL API (simulado)
# =========================================
@api.route("/external-routines", methods=["GET"])
def external_routines():
    query = request.args.get("q", "")
    sample = [
        {"name": f"Rutina {query} 1", "description": "Descripción de ejemplo"},
        {"name": f"Rutina {query} 2", "description": "Otra rutina de muestra"},
    ]
    return jsonify(sample), 200


# =========================================
# AI ROUTINES
# =========================================
@api.route("/ai-routine", methods=["POST"])
def ai_routine():
    body = request.get_json()
    prompt = body.get("prompt", "")
    result = generate_ai_routine(prompt)
    return jsonify(result), 200


@api.route("/ai-routine/save", methods=["POST"])
@jwt_required()
def save_ai_routine():
    user_id = int(get_jwt_identity())
    body = request.get_json()
    return jsonify({"msg": "Rutina guardada (simulado)"}), 201


# =========================================
# ROUTINE EXERCISES (agregar, quitar, etc.)
# =========================================
@api.route('/routines/<int:routine_id>/exercises', methods=['POST'])
@jwt_required()
def add_exercise_to_routine(routine_id):
    user_id = int(get_jwt_identity())
    routine = Routine.query.get(routine_id)
    if not routine or routine.created_by != user_id:
        return jsonify({'msg': 'Rutina no encontrada o no tienes permiso'}), 404

    body = request.get_json()
    exercise_id = body.get('exercise_id')
    sets = body.get('sets', 3)
    reps = body.get('reps', '10')

    if not exercise_id:
        return jsonify({'msg': 'exercise_id requerido'}), 400

    exercise = Exercise.query.get(exercise_id)
    if not exercise:
        return jsonify({'msg': 'Ejercicio no encontrado'}), 404

    existing = RoutineExercise.query.filter_by(routine_id=routine_id, exercise_id=exercise_id).first()
    if existing:
        return jsonify({'msg': 'El ejercicio ya está en la rutina'}), 400

    max_order = db.session.query(db.func.max(RoutineExercise.order)).filter_by(routine_id=routine_id).scalar() or 0

    re = RoutineExercise(
        routine_id=routine_id,
        exercise_id=exercise_id,
        sets=sets,
        reps=reps,
        order=max_order + 1
    )
    db.session.add(re)
    db.session.commit()

    return jsonify(re.serialize()), 201


@api.route('/routines/<int:routine_id>/exercises/<int:exercise_id>', methods=['PUT'])
@jwt_required()
def update_routine_exercise(routine_id, exercise_id):
    user_id = int(get_jwt_identity())
    routine = Routine.query.get(routine_id)
    if not routine or routine.created_by != user_id:
        return jsonify({'msg': 'Rutina no encontrada o no tienes permiso'}), 404

    re = RoutineExercise.query.filter_by(routine_id=routine_id, exercise_id=exercise_id).first()
    if not re:
        return jsonify({'msg': 'Ejercicio no encontrado en esta rutina'}), 404

    body = request.get_json()
    if 'sets' in body:
        re.sets = body['sets']
    if 'reps' in body:
        re.reps = body['reps']
    if 'order' in body:
        re.order = body['order']

    db.session.commit()
    return jsonify(re.serialize()), 200


@api.route('/routines/<int:routine_id>/exercises/<int:exercise_id>', methods=['DELETE'])
@jwt_required()
def remove_exercise_from_routine(routine_id, exercise_id):
    user_id = int(get_jwt_identity())
    routine = Routine.query.get(routine_id)
    if not routine or routine.created_by != user_id:
        return jsonify({'msg': 'Rutina no encontrada o no tienes permiso'}), 404

    re = RoutineExercise.query.filter_by(routine_id=routine_id, exercise_id=exercise_id).first()
    if not re:
        return jsonify({'msg': 'Ejercicio no encontrado en esta rutina'}), 404

    db.session.delete(re)
    db.session.commit()
    return jsonify({'msg': 'Ejercicio eliminado de la rutina'}), 200


@api.route('/my-routines', methods=['GET'])
@jwt_required()
def get_my_routines():
    user_id = int(get_jwt_identity())
    routines = Routine.query.filter_by(created_by=user_id).all()
    return jsonify([r.serialize() for r in routines]), 200