from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from api.routes import api
from api.models import db
from api.admin import setup_admin
from api.commands import setup_commands
import os


def create_app():
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = "super-secret-key"
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///gym.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True
    )

    db.init_app(app)
    JWTManager(app)

    app.register_blueprint(api, url_prefix="/api")
    setup_admin(app)
    setup_commands(app)

    @app.route("/")
    def home():
        return {"msg": "Gym API Running"}

    # 👇 AGREGA ESTO
    with app.app_context():
        db.create_all()

    return app