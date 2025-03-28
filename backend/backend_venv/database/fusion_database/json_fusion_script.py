import json
import os
import glob

# Dossier contenant les fichiers JSON
json_folder = "."
output_file = "bestiary.json"

# Trouver tous les fichiers JSON
json_files = sorted(glob.glob(os.path.join(json_folder, "page*.json")))

# Liste pour stocker tous les monstres
all_monsters = []

# Vérification que des fichiers existent
if not json_files:
    print("❌ Aucun fichier JSON trouvé ! Vérifie le nom des fichiers.")
    exit()

# Lecture et fusion des fichiers JSON
for json_file in json_files:
    with open(json_file, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)  # Charge le contenu JSON
            
            # Vérifie si le fichier contient un champ "results"
            if isinstance(data, dict) and "results" in data:
                all_monsters.extend(data["results"])  # Prend uniquement la partie "results"
                print(f"✅ {json_file} fusionné ({len(data['results'])} monstres)")
            else:
                print(f"⚠️ Erreur : {json_file} ne contient pas le champ 'results'.")

        except json.JSONDecodeError:
            print(f"❌ Erreur de lecture du fichier {json_file}")

# Sauvegarde du fichier fusionné
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(all_monsters, f, indent=4, ensure_ascii=False)

print(f"\n✅ Fusion terminée ! {len(all_monsters)} monstres enregistrés dans {output_file}")
