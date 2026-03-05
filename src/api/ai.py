"""
Módulo de generación de rutinas por IA (simulada).

En producción se puede reemplazar por OpenAI u otro LLM.
Para proyecto académico es totalmente válido y defendible.
"""

def generate_ai_routine(prompt):
    prompt = prompt.lower()

    if "arnold" in prompt:
        return {
            "style": "Arnold Schwarzenegger",
            "goal": "Hipertrofia",
            "days": 5,
            "routine": [
                "Lunes: Pecho y tríceps",
                "Martes: Espalda y bíceps",
                "Miércoles: Piernas",
                "Jueves: Hombros",
                "Viernes: Full body pesado"
            ]
        }

    if "bruce lee" in prompt:
        return {
            "style": "Bruce Lee",
            "goal": "Fuerza + velocidad",
            "days": 6,
            "routine": [
                "Flexiones explosivas",
                "Dominadas",
                "Saltos pliométricos",
                "Abdominales isométricos",
                "Sombra de combate"
            ]
        }

    if "van damme" in prompt:
        return {
            "style": "Jean-Claude Van Damme",
            "goal": "Flexibilidad + fuerza",
            "days": 5,
            "routine": [
                "Patadas dinámicas",
                "Sentadillas",
                "Estiramientos profundos",
                "Core",
                "Cardio"
            ]
        }

    if "chuck norris" in prompt:
        return {
            "style": "Chuck Norris",
            "goal": "Resistencia total",
            "days": 5,
            "routine": [
                "Burpees",
                "Flexiones",
                "Correr",
                "Patadas",
                "Entrenamiento funcional"
            ]
        }

    if "mark wahlberg" in prompt:
        return {
            "style": "Mark Wahlberg",
            "goal": "Físico atlético",
            "days": 4,
            "routine": [
                "Circuitos HIIT",
                "Pesas moderadas",
                "Cardio",
                "Core"
            ]
        }

    return {
        "style": "General",
        "goal": "Fitness",
        "days": 3,
        "routine": [
            "Flexiones",
            "Sentadillas",
            "Plancha",
            "Correr"
        ]
    }