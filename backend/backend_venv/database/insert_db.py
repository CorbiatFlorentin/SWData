import json
import sqlite3
import os
import bcrypt
from datetime import datetime, timedelta

# Définition des fichiers
db_name = 'mydatabase.db'
json_file = 'fusion_database/bestiary.json'

# Vérification de l'existence des fichiers
if not os.path.isfile(db_name):
    raise FileNotFoundError(f"La base de données '{os.path.abspath(db_name)}' est introuvable.")
if not os.path.isfile(json_file):
    raise FileNotFoundError(f"Le fichier JSON '{os.path.abspath(json_file)}' est introuvable.")

# Connexion à la base de données
print(f"📂 Connexion à la base de données : {os.path.abspath(db_name)}")
conn = sqlite3.connect(db_name)
cursor = conn.cursor()

try:
    conn.execute("PRAGMA foreign_keys = OFF;")
    print("🔑 Clés étrangères activées.")

    print(f"🗕️ Chargement des données depuis {json_file}")
    with open(json_file, 'r', encoding='utf-8') as f:
        monsters_data = json.load(f)

    element_map = {"Fire": 1, "Water": 2, "Wind": 3, "Light": 4, "Dark": 5}
    archetype_map = {"Attack": 1, "Defense": 2, "Support": 3, "HP": 4}

    # Pré-insertion des leader_skills pour éviter les erreurs FK
    for monster in monsters_data:
        if monster["leader_skill"]:
            leader = monster["leader_skill"]
            cursor.execute('''
            INSERT OR IGNORE INTO leader_skills (id, attribute, amount, area, element)
            VALUES (?, ?, ?, ?, ?)
            ''', (leader["id"], leader["attribute"], leader["amount"], leader["area"], leader["element"]))

    # Insertion des monstres et compétences
    for monster in monsters_data:
        monster_id = monster["id"]
        name = monster["name"]
        bestiary_slug = monster["bestiary_slug"]
        com2us_id = monster["com2us_id"]
        family_id = monster["family_id"]
        skill_group_id = monster["skill_group_id"]
        image_filename = monster["image_filename"]
        element_id = element_map.get(monster["element"], None)
        archetype_id = archetype_map.get(monster["archetype"], None)
        base_stars = monster["base_stars"]
        natural_stars = monster["natural_stars"]
        obtainable = int(monster["obtainable"])
        can_awaken = int(monster["can_awaken"])
        awaken_level = monster["awaken_level"]
        awaken_bonus = monster["awaken_bonus"]
        skill_ups_to_max = monster["skill_ups_to_max"]
        leader_skill_id = monster["leader_skill"]["id"] if monster["leader_skill"] else None
        base_hp = monster["base_hp"]
        base_attack = monster["base_attack"]
        base_defense = monster["base_defense"]
        speed = monster["speed"]
        crit_rate = monster["crit_rate"]
        crit_damage = monster["crit_damage"]
        resistance = monster["resistance"]
        accuracy = monster["accuracy"]
        max_lvl_hp = monster["max_lvl_hp"]
        max_lvl_attack = monster["max_lvl_attack"]
        max_lvl_defense = monster["max_lvl_defense"]
        awakens_from = monster["awakens_from"]
        awakens_to = monster["awakens_to"]

        cursor.execute('''
        INSERT OR REPLACE INTO monsters (
            id, name, bestiary_slug, com2us_id, family_id, skill_group_id, image_filename,
            element_id, archetype_id, base_stars, natural_stars, obtainable, can_awaken,
            awaken_level, awaken_bonus, skill_ups_to_max, leader_skill_id,
            base_hp, base_attack, base_defense, speed, crit_rate, crit_damage,
            resistance, accuracy, max_lvl_hp, max_lvl_attack, max_lvl_defense,
            awakens_from, awakens_to
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            monster_id, name, bestiary_slug, com2us_id, family_id, skill_group_id, image_filename,
            element_id, archetype_id, base_stars, natural_stars, obtainable, can_awaken,
            awaken_level, awaken_bonus, skill_ups_to_max, leader_skill_id,
            base_hp, base_attack, base_defense, speed, crit_rate, crit_damage,
            resistance, accuracy, max_lvl_hp, max_lvl_attack, max_lvl_defense,
            awakens_from, awakens_to
        ))

        # Insertion des compétences liées
        for skill_id in monster["skills"]:
            cursor.execute('INSERT OR IGNORE INTO skills (id) VALUES (?)', (skill_id,))
            cursor.execute('INSERT OR IGNORE INTO monster_skills (monster_id, skill_id) VALUES (?, ?)', (monster_id, skill_id))

    # Ajout d'un administrateur par défaut
    admin_email = "admin@example.com"
    admin_password = "admin123"
    hashed_pw = bcrypt.hashpw(admin_password.encode(), bcrypt.gensalt()).decode()
    now = datetime.now()

    cursor.execute('''
    INSERT OR IGNORE INTO users (nom, prenom, pseudo, email, mot_de_passe, role, created_at, last_activity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', ("Admin", "Master", "AdminUser", admin_email, hashed_pw, "admin", now, now))

    print("\n👤 Administrateur ajouté avec succès.")

    # Suppression des comptes inactifs (RGPD)
    def delete_old_users():
        limit_date = datetime.now() - timedelta(days=3*365)
        cursor.execute("DELETE FROM users WHERE last_activity < ?", (limit_date,))
        print("🗑️ Comptes inactifs supprimés.")

    delete_old_users()

    conn.commit()
    print("\n🚀 Toutes les données ont été insérées avec succès.")

    cursor.execute("SELECT user_id, email, role, created_at, last_activity FROM users;")
    for row in cursor.fetchall():
        print(row)

except sqlite3.Error as e:
    print(f"❌ Erreur globale : {e}")

finally:
    if conn:
        conn.close()
        print("🔐 Connexion fermée.")
