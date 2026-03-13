from src.app import create_app
from api.models import db, Exercise

app = create_app()

# Lista de ejercicios de muestra (sin depender de APIs externas)
MOCK_EXERCISES = [
    # Pecho
    {"name": "Push Up", "muscle": "chest", "equipment": "body weight", "type": "strength", "gif_url": "https://via.placeholder.com/300x200?text=Push+Up"},
    {"name": "Bench Press", "muscle": "chest", "equipment": "barbell", "type": "strength", "gif_url": "https://via.placeholder.com/300x200?text=Bench+Press"},
    {"name": "Dumbbell Fly", "muscle": "chest", "equipment": "dumbbell", "type": "strength", "gif_url": "https://via.placeholder.com/300x200?text=Dumbbell+Fly"},
    {"name": "Incline Press", "muscle": "chest", "equipment": "barbell", "type": "strength", "gif_url": "https://via.placeholder.com/300x200?text=Incline+Press"},
    # Espalda
    {"name": "Pull Up", "muscle": "back", "equipment": "pull-up bar", "type": "strength", "gif_url": "https://via.placeholder.com/300x200?text=Pull+Up"},
    {"name": "Deadlift", "muscle": "back", "equipment": "barbell", "type": "strength", "gif_url": "https://via.placeholder.com/300x200?text=Deadlift"},
    {"name": "Bent Over Row", "muscle": "back", "equipment": "barbell", "type": "strength", "gif_url": "https://via.placeholder.com/300x200?text=Bent+Over+Row"},
    # Piernas
    {"name": "Squat", "muscle": "quadriceps", "equipment": "body weight", "type": "strength", "gif_url": "https://via.placeholder.com/300x200?text=Squat"},
    {"name": "Lunges", "muscle": "quadriceps", "equipment": "body weight", "type": "strength", "gif_url": "https://via.placeholder.com/300x200?text=Lunges"},
    {"name": "Leg Press", "muscle": "quadriceps", "equipment": "machine", "type": "strength", "gif_url": "https://via.placeholder.com/300x200?text=Leg+Press"},
    {"name": "Calf Raises", "muscle": "calves", "equipment": "body weight", "type": "strength", "gif_url": "https://via.placeholder.com/300x200?text=Calf+Raises"},
    # Hombros
    {"name": "Overhead Press", "muscle": "shoulders", "equipment": "barbell", "type": "strength", "gif_url": "https://via.placeholder.com/300x200?text=Overhead+Press"},
    {"name": "Lateral Raise", "muscle": "shoulders", "equipment": "dumbbell", "type": "strength", "gif_url": "https://via.placeholder.com/300x200?text=Lateral+Raise"},
    {"name": "Front Raise", "muscle": "shoulders", "equipment": "dumbbell", "type": "strength", "gif_url": "https://via.placeholder.com/300x200?text=Front+Raise"},
    # Bíceps
    {"name": "Bicep Curl", "muscle": "biceps", "equipment": "dumbbell", "type": "strength", "gif_url": "https://via.placeholder.com/300x200?text=Bicep+Curl"},
    {"name": "Hammer Curl", "muscle": "biceps", "equipment": "dumbbell", "type": "strength", "gif_url": "https://via.placeholder.com/300x200?text=Hammer+Curl"},
    # Tríceps
    {"name": "Tricep Dip", "muscle": "triceps", "equipment": "parallel bars", "type": "strength", "gif_url": "https://via.placeholder.com/300x200?text=Tricep+Dip"},
    {"name": "Tricep Extension", "muscle": "triceps", "equipment": "dumbbell", "type": "strength", "gif_url": "https://via.placeholder.com/300x200?text=Tricep+Extension"},
    # Abdominales
    {"name": "Plank", "muscle": "abs", "equipment": "body weight", "type": "strength", "gif_url": "https://via.placeholder.com/300x200?text=Plank"},
    {"name": "Crunches", "muscle": "abs", "equipment": "body weight", "type": "strength", "gif_url": "https://via.placeholder.com/300x200?text=Crunches"},
    {"name": "Leg Raises", "muscle": "abs", "equipment": "body weight", "type": "strength", "gif_url": "https://via.placeholder.com/300x200?text=Leg+Raises"},
]

def run_mock_seed():
    with app.app_context():
        # Preguntar si desea borrar los datos existentes
        existing = Exercise.query.count()
        if existing > 0:
            print(f"Ya existen {existing} ejercicios. ¿Deseas eliminarlos y volver a insertar? (s/n)")
            respuesta = input().strip().lower()
            if respuesta == 's':
                print("Eliminando ejercicios existentes...")
                db.session.query(Exercise).delete()
                db.session.commit()
                print("Ejercicios eliminados.")
            else:
                print("Operación cancelada.")
                return

        # Insertar los nuevos ejercicios
        for ex in MOCK_EXERCISES:
            new_ex = Exercise(
                name=ex["name"],
                muscle=ex["muscle"],
                equipment=ex["equipment"],
                type=ex["type"],
                gif_url=ex["gif_url"]
            )
            db.session.add(new_ex)

        db.session.commit()
        print(f"✅ Insertados {len(MOCK_EXERCISES)} ejercicios de muestra.")

if __name__ == "__main__":
    run_mock_seed()