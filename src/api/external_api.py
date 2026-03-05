import requests
import os

EXERCISE_API_URL = "https://exercisedb.p.rapidapi.com/exercises"
EXERCISE_API_KEY = os.getenv("EXERCISE_API_KEY")

HEADERS = {
    "X-RapidAPI-Key": EXERCISE_API_KEY,
    "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"
}


def search_exercises(query="chest"):

    try:

        # endpoint más fiable
        url = f"{EXERCISE_API_URL}/target/{query}"

        response = requests.get(
            url,
            headers=HEADERS,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        exercises = []

        for ex in data[:12]:

            exercises.append({
                "name": ex.get("name"),
                "bodyPart": ex.get("bodyPart"),
                "target": ex.get("target"),
                "equipment": ex.get("equipment"),
                "gifUrl": ex.get("gifUrl")
            })

        return exercises

    except Exception as e:

        print("ERROR API EXTERNA:", e)
        return []