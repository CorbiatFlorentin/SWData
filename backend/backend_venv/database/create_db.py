import sqlite3
import os 
# Nom du fichier SQLite
db_name = 'mydatabase.db'
print(os.path.abspath("mydatabase.db"))

def table_exists(cursor, table_name):
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?;", (table_name,))
    return cursor.fetchone() is not None

def clear_tables(cursor, tables):
    cursor.execute("PRAGMA foreign_keys = ON;")
    for table in tables:
        if table_exists(cursor, table):
            cursor.execute(f"DELETE FROM {table};")
            print(f"Table '{table}' vidée.")
        else:
            print(f"Table '{table}' inexistante, sautée.")
    cursor.execute("PRAGMA foreign_keys = ON;")

try:
    conn = sqlite3.connect(db_name)
    print(f"Connexion à la base de données '{db_name}' établie avec succès.")
    cursor = conn.cursor()

    print("Création des tables...")

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS elements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS archetypes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS leader_skills (
        id INTEGER PRIMARY KEY,
        attribute TEXT,
        amount INTEGER,
        area TEXT,
        element TEXT
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS monsters (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        bestiary_slug TEXT UNIQUE NOT NULL,
        com2us_id INTEGER UNIQUE NOT NULL,
        family_id INTEGER,
        skill_group_id INTEGER,
        image_filename TEXT,
        element_id INTEGER,
        archetype_id INTEGER,
        base_stars INTEGER,
        natural_stars INTEGER,
        obtainable BOOLEAN,
        can_awaken BOOLEAN,
        awaken_level INTEGER,
        awaken_bonus TEXT,
        skill_ups_to_max INTEGER,
        leader_skill_id INTEGER,
        base_hp INTEGER,
        base_attack INTEGER,
        base_defense INTEGER,
        speed INTEGER,
        crit_rate INTEGER,
        crit_damage INTEGER,
        resistance INTEGER,
        accuracy INTEGER,
        max_lvl_hp INTEGER,
        max_lvl_attack INTEGER,
        max_lvl_defense INTEGER,
        awakens_from INTEGER,
        awakens_to INTEGER,
        FOREIGN KEY (element_id) REFERENCES elements(id),
        FOREIGN KEY (archetype_id) REFERENCES archetypes(id),
        FOREIGN KEY (leader_skill_id) REFERENCES leader_skills(id)
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY,
        name TEXT,
        description TEXT
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS monster_skills (
        monster_id INTEGER,
        skill_id INTEGER,
        PRIMARY KEY (monster_id, skill_id),
        FOREIGN KEY (monster_id) REFERENCES monsters(id),
        FOREIGN KEY (skill_id) REFERENCES skills(id)
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        prenom TEXT NOT NULL,
        pseudo TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        mot_de_passe TEXT NOT NULL,
        role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    tables_to_clear = [
        'users', 'elements', 'archetypes', 'monsters', 'skills', 'monster_skills', 'leader_skills'
    ]

    print("Vidage des tables...")
    clear_tables(cursor, tables_to_clear)

    cursor.executemany('''
    INSERT OR IGNORE INTO elements (name) VALUES (?)
    ''', [("Fire",), ("Water",), ("Wind",), ("Light",), ("Dark",)])

    cursor.executemany('''
    INSERT OR IGNORE INTO archetypes (name) VALUES (?)
    ''', [("Attack",), ("Defense",), ("Support",), ("HP",)])

    conn.commit()
    print("Opérations terminées avec succès.")

except sqlite3.Error as e:
    print(f"Erreur lors de l'exécution SQL : {e}")
    if "no such table" in str(e):
        print("Une table requise est manquante. Assurez-vous qu'elle est créée avant d'exécuter des opérations.")

finally:
    if conn:
        conn.close()
        print("Connexion fermée.")
