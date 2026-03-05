from .models import db, Reward

def setup_commands(app):

    @app.cli.command("seed")
    def seed():
        rewards = [
            Reward(name="Mancuernas", description="Mancuernas 5kg", cost=100),
            Reward(name="Vaso Shaker", description="Shaker fitness", cost=50),
            Reward(name="Camiseta Deportiva", description="Ropa deportiva", cost=150)
        ]

        db.session.add_all(rewards)
        db.session.commit()
        print("Recompensas creadas")