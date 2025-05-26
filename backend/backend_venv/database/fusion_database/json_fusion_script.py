import json
import os
import glob

json_folder = "."
output_file = "bestiary.json"

# FindAll files  JSON
json_files = sorted(glob.glob(os.path.join(json_folder, "page*.json")))

# List for stock all monsters
all_monsters = []

# Check taht files exists
if not json_files:
    print("❌ No files found ! Check their name .")
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
                print(f"⚠️ Error : {json_file} doesn't have the field 'results'.")

        except json.JSONDecodeError:
            print(f"❌ Error while reading files {json_file}")

# Sauvegarde du fichier fusionné
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(all_monsters, f, indent=4, ensure_ascii=False)

print(f"\n✅ Fusion finished ! {len(all_monsters)} monsters saved in  {output_file}")
