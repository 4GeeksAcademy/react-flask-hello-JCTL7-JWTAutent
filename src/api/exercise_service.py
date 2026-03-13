import requests
import os

NINJA_KEY = os.getenv("NINJA_API_KEY")


def ninja_exercises(query="chest"):

    url = f"https://api.api-ninjas.com/v1/exercises?muscle={query}"

    headers = {
        "X-Api-Key": NINJA_KEY
    }

    try:

        r = requests.get(url, headers=headers)

        if r.status_code != 200:
            return []

        data = r.json()

        results = []

        for ex in data:

            results.append({
                "name": ex.get("name"),
                "muscle": ex.get("muscle"),
                "equipment": ex.get("equipment"),
                "type": ex.get("type"),
                "gifUrl": None
            })

        return results

    except Exception as e:

        print("NINJA API ERROR:", e)
        return []