import json
import os
import sys

# Ajustar path para importar desde src
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from src.app import create_app
from api.models import db, Exercise

app = create_app()

# Ruta al archivo JSON descargado
JSON_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'exercises.json')

def run_seed():
    with app.app_context():
        # Verificar si el archivo existe
        if not os.path.exists(JSON_PATH):
            print(f"❌ No se encontró el archivo {JSON_PATH}")
            print("   Asegúrate de haber descargado exercises.json en src/data/")
            return

        # Cargar el JSON
        with open(JSON_PATH, 'r', encoding='utf-8') as f:
            ejercicios = json.load(f)

        print(f"📦 Se cargaron {len(ejercicios)} ejercicios desde el JSON.")

        # Preguntar si borrar los existentes
        existentes = Exercise.query.count()
        if existentes > 0:
            respuesta = input(f"Actualmente hay {existentes} ejercicios. ¿Deseas eliminarlos antes de insertar los nuevos? (s/n): ").strip().lower()
            if respuesta == 's':
                db.session.query(Exercise).delete()
                db.session.commit()
                print("🗑️ Ejercicios antiguos eliminados.")
            else:
                print("➕ Se insertarán solo los nuevos (evitando duplicados).")

        total_insertados = 0
        for ex in ejercicios:
            # Evitar duplicados por nombre
            if Exercise.query.filter_by(name=ex['name']).first():
                continue

            # Determinar el músculo principal (tomamos el primero de primaryMuscles)
            muscle = ex.get('primaryMuscles', [None])[0] if ex.get('primaryMuscles') else None

            # Construir URL de la imagen principal (si existe)
            imagen_url = None
            if ex.get('images') and len(ex['images']) > 0:
                # La URL base es: https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/
                imagen_url = f"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/{ex['images'][0]}"

            # Crear el nuevo ejercicio
            nuevo = Exercise(
                name=ex['name'],
                muscle=muscle,
                equipment=ex.get('equipment'),
                type=ex.get('category'),
                gif_url=imagen_url
            )
            db.session.add(nuevo)
            total_insertados += 1

            # Commit cada 50 para no saturar
            if total_insertados % 50 == 0:
                db.session.commit()
                print(f"  ... {total_insertados} ejercicios insertados")

        # Commit final
        db.session.commit()
        print(f"✅ Proceso completado. Total de ejercicios insertados: {total_insertados}")

if __name__ == "__main__":
    run_seed()