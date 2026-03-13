import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from api.routes import api
from api.models import db
from api.admin import setup_admin
from api.commands import setup_commands

def create_app():
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = "super-secret-key"

    # Configurar base de datos
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "..", "gym.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Inicializar extensiones
    db.init_app(app)
    JWTManager(app)

    # Configurar CORS para todas las rutas
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Registrar blueprint
    app.register_blueprint(api, url_prefix="/api")

    # Admin y comandos
    setup_admin(app)
    setup_commands(app)

    @app.route("/")
    def home():
        return {"msg": "Gym API Running"}

    with app.app_context():
        db.create_all()

    return app