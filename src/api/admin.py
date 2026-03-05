from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from .models import db, User, Routine, Reward

def setup_admin(app):
    admin = Admin(app, name="Gym Admin")
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Routine, db.session))
    admin.add_view(ModelView(Reward, db.session))