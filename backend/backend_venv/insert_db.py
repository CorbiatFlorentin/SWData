import json
import sqlite3
import os

# Chemin de la base de données et du fichier JSON
db_name = 'mydatabase.db'
json_file = './Test/test_bestiary.json'

# Vérification des fichiers et répertoires
if not os.path.isfile(db_name):
    raise FileNotFoundError(f"La base de données '{os.path.abspath(db_name)}' est introuvable.")
if not os.path.isfile(json_file):
    raise FileNotFoundError(f"Le fichier JSON '{os.path.abspath(json_file)}' est introuvable.")

# Chargement du fichier JSON
print(f"Chargement des données depuis {os.path.abspath(json_file)}")
with open(json_file, 'r') as f:
    monsters_data = json.load(f)

# Connexion à la base de données
print(f"Connexion à la base de données : {os.path.abspath(db_name)}")
conn = sqlite3.connect(db_name)
cursor = conn.cursor()

try:
    # Activation des clés étrangères
    conn.execute("PRAGMA foreign_keys = ON;")
    print("Clés étrangères activées.")

    # Désactiver les contraintes pour vider les tables
    conn.execute("PRAGMA foreign_keys = ON;")
    print("Clés étrangères désactivées temporairement.")

    # Vidage des tables
    cursor.execute('DELETE FROM monster_skills')
    cursor.execute('DELETE FROM competence')
    cursor.execute('DELETE FROM stats')
    cursor.execute('DELETE FROM monster_status')
    print("Tables vidées.")

    # Réactiver les contraintes
    conn.execute("PRAGMA foreign_keys = ON;")
    print("Clés étrangères réactivées.")
    conn.commit()

    # Préparer les mappings pour les éléments et les types
    element_map = {"fire": 2, "water": 3, "wind": 1, "light": 4, "dark": 5}
    archetype_map = {"attack": 1, "support": 2, "defense": 3, "hp": 4}

    # Insérer les types et éléments si nécessaires
    cursor.executemany('''
    INSERT OR IGNORE INTO monster_type (id, type_name) VALUES (?, ?)
    ''', [(1, 'attack'), (2, 'support'), (3, 'defense'), (4, 'hp')])

    cursor.executemany('''
    INSERT OR IGNORE INTO monster_elements (id, element_name) VALUES (?, ?)
    ''', [(1, 'wind'), (2, 'fire'), (3, 'water'), (4, 'light'), (5, 'dark')])

    conn.commit()
    print("Données initiales insérées dans monster_type et monster_elements.")

    # Insertion des monstres
    for monster in monsters_data:
        fields = monster['fields']
        monster_id = monster['pk']

        # Mapping des éléments et types
        element_id = element_map.get(fields.get('element', '').lower())
        archetype_id = archetype_map.get(fields.get('archetype', '').lower())

        # Insertion dans monster_status
        try:
            cursor.execute('''
            INSERT INTO monster_status (
                monster_id, name, eveil, famille, awaken_bonus, obtainable, type_id, element_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                monster_id,
                fields.get('name', ''),
                fields.get('is_awakened', False),
                fields.get('family_id', None),
                fields.get('awaken_bonus', ''),
                fields.get('obtainable', False),
                archetype_id,
                element_id
            ))
            print(f"Inséré dans monster_status : {monster_id}, {fields.get('name', '')}")
        except sqlite3.Error as e:
            print(f"Erreur SQL pour monster_status ({monster_id}): {e}")

        # Insertion dans stats
        try:
            cursor.execute('''
            INSERT INTO stats (
                monster_id, hp, attaque, defense, vitesse, taux_crit, dommages_crit, resistance, precision
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                monster_id,
                fields.get('base_hp', 0),
                fields.get('base_attack', 0),
                fields.get('base_defense', 0),
                fields.get('speed', 0),
                fields.get('crit_rate', 0),
                fields.get('crit_damage', 0),
                fields.get('resistance', 0),
                fields.get('accuracy', 0),
            ))
            print(f"Inséré dans stats : {monster_id}")
        except sqlite3.Error as e:
            print(f"Erreur SQL pour stats ({monster_id}): {e}")

        # Insertion dans competence
        try:
            cursor.execute('''
            INSERT INTO competence (monster_id, sort1, sort2, sort3)
            VALUES (?, ?, ?, ?)
            ''', (
                monster_id,
                fields['skills'][0] if len(fields.get('skills', [])) > 0 else None,
                fields['skills'][1] if len(fields.get('skills', [])) > 1 else None,
                fields['skills'][2] if len(fields.get('skills', [])) > 2 else None
            ))
            print(f"Inséré dans competence : {monster_id}")
        except sqlite3.Error as e:
            print(f"Erreur SQL pour competence ({monster_id}): {e}")

        # Insertion dans monster_skills
        try:
            for skill_id in fields.get('skills', []):
                cursor.execute('''
                INSERT INTO monster_skills (monster_id, skill_id) VALUES (?, ?)
                ''', (monster_id, skill_id))
            print(f"Compétences insérées pour le monstre {monster_id}")
        except sqlite3.Error as e:
            print(f"Erreur SQL pour monster_skills ({monster_id}): {e}")

    # Valider les changements
    conn.commit()
    print("Toutes les données ont été insérées avec succès.")

    # Vérification des données insérées
    print("\nVérification des données insérées :")
    cursor.execute("SELECT * FROM monster_status")
    rows = cursor.fetchall()
    print("Contenu de monster_status :")
    for row in rows:
        print(row)

    cursor.execute("SELECT * FROM stats")
    rows = cursor.fetchall()
    print("Contenu de stats :")
    for row in rows:
        print(row)

    cursor.execute("SELECT * FROM competence")
    rows = cursor.fetchall()
    print("Contenu de competence :")
    for row in rows:
        print(row)

except sqlite3.Error as e:
    print(f"Erreur globale : {e}")

finally:
    # Toujours fermer la connexion à la base de données
    if conn:
        conn.close()
        print("Connexion fermée.")
