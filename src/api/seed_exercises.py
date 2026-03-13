import os
import requests
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from src.app import create_app
from api.models import db, Exercise

app = create_app()

EXERCISE_API_KEY = os.getenv("EXERCISE_API_KEY")
if not EXERCISE_API_KEY:
    raise ValueError("Debes definir EXERCISE_API_KEY en el archivo .env")

HEADERS = {
    "X-RapidAPI-Key": EXERCISE_API_KEY,
    "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"
}

BODY_PARTS = [
    "back", "cardio", "chest", "lower arms", "lower legs",
    "neck", "shoulders", "upper arms", "upper legs", "waist"
]

def fetch_exercises_by_body_part(part):
    url = f"https://exercisedb.p.rapidapi.com/exercises/bodyPart/{part}"
    try:
        response = requests.get(url, headers=HEADERS, timeout=15)
        if response.status_code != 200:
            print(f"Error {response.status_code} para bodyPart '{part}': {response.text}")
            return []
        return response.json()
    except Exception as e:
        print(f"Excepción con bodyPart '{part}': {e}")
        return []

def run_seed():
    with app.app_context():
        existentes = Exercise.query.count()
        if existentes > 0:
            print(f"Actualmente hay {existentes} ejercicios en la BD.")
            respuesta = input("¿Deseas eliminarlos antes de insertar los nuevos? (s/n): ").strip().lower()
            if respuesta == 's':
                db.session.query(Exercise).delete()
                db.session.commit()
                print("Ejercicios antiguos eliminados.")
            else:
                print("Manteniendo ejercicios existentes. Se insertarán solo los nuevos (evitando duplicados).")

        total_insertados = 0
        for part in BODY_PARTS:
            print(f"🔄 Obteniendo ejercicios para: {part}")
            exercises = fetch_exercises_by_body_part(part)
            if not exercises:
                print(f"  -> No se obtuvieron ejercicios para {part}")
                continue

            for ex in exercises:
                if Exercise.query.filter_by(name=ex["name"]).first():
                    continue
                nuevo = Exercise(
                    name=ex["name"],
                    muscle=ex["target"],
                    equipment=ex.get("equipment"),
                    type=ex.get("bodyPart"),
                    gif_url=ex.get("gifUrl")
                )
                db.session.add(nuevo)
                total_insertados += 1

            db.session.commit()
            print(f"  -> Insertados hasta ahora: {total_insertados}")

        print(f"✅ Proceso completado. Total de ejercicios insertados: {total_insertados}")

if __name__ == "__main__":
    run_seed()