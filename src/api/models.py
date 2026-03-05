from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

# USER

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    role = db.Column(db.String(20), default="free")  # free | premium
    points = db.Column(db.Integer, default=0)
    is_verified = db.Column(db.Boolean, default=False)

    routines = db.relationship("Routine", backref="creator", lazy=True)
    goals = db.relationship("Goal", backref="user", lazy=True)
    rewards = db.relationship("UserReward", backref="user", lazy=True)
    training_logs = db.relationship("TrainingLog", backref="user", lazy=True)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "points": self.points,
            "is_verified": self.is_verified
        }


# ROUTINES

class Routine(db.Model):
    __tablename__ = "routine"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.String(20))  # beginner | intermediate | advanced
    style = db.Column(db.String(50))       # Arnold, Bruce Lee, etc.
    is_public = db.Column(db.Boolean, default=True)

    created_by = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "difficulty": self.difficulty,
            "style": self.style,
            "is_public": self.is_public,
            "created_by": self.created_by
        }


# GOALS

class Goal(db.Model):
    __tablename__ = "goal"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    target = db.Column(db.Integer, nullable=False)
    progress = db.Column(db.Integer, default=0)
    completed = db.Column(db.Boolean, default=False)

    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "target": self.target,
            "progress": self.progress,
            "completed": self.completed
        }


# REWARDS

class Reward(db.Model):
    __tablename__ = "reward"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    cost = db.Column(db.Integer, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "cost": self.cost
        }


# USER REWARDS 
class UserReward(db.Model):
    __tablename__ = "user_reward"

    id = db.Column(db.Integer, primary_key=True)
    claimed = db.Column(db.Boolean, default=False)

    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    reward_id = db.Column(db.Integer, db.ForeignKey("reward.id"), nullable=False)

    reward = db.relationship("Reward")

    def serialize(self):
        return {
            "id": self.id,
            "claimed": self.claimed,
            "reward": self.reward.serialize()
        }
    
# TRAINING LOG 

class TrainingLog(db.Model):
    __tablename__ = "training_log"

    id = db.Column(db.Integer, primary_key=True)
    completed_at = db.Column(db.DateTime, server_default=db.func.now())

    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    routine_id = db.Column(db.Integer, db.ForeignKey("routine.id"), nullable=False)

    routine = db.relationship("Routine")

    def serialize(self):
        return {
            "id": self.id,
            "completed_at": self.completed_at,
            "routine": self.routine.serialize()
        }    