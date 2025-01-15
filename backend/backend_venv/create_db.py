import sqlite3

# Nom du fichier SQLite
db_name = 'mydatabase.db'

def table_exists(cursor, table_name):
    """
    Vérifie si une table existe dans la base de données.
    """
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?;", (table_name,))
    return cursor.fetchone() is not None

def clear_tables(cursor, tables):
    """
    Vide les tables spécifiées tout en désactivant temporairement les contraintes de clés étrangères.
    """
    cursor.execute("PRAGMA foreign_keys = ON;")  # Désactive temporairement les clés étrangères
    for table in tables:
        if table_exists(cursor, table):
            cursor.execute(f"DELETE FROM {table};")
            print(f"Table '{table}' vidée.")
        else:
            print(f"Table '{table}' inexistante, sautée.")
    cursor.execute("PRAGMA foreign_keys = ON;")  # Réactive les clés étrangères

def safely_lower(value):
    """
    Retourne une version en minuscules de la valeur si possible.
    Si la valeur est None, retourne une chaîne vide.
    """
    return value.lower() if isinstance(value, str) else ''

try:
    # Créer une connexion à la base de données
    conn = sqlite3.connect(db_name)
    print(f"Connexion à la base de données '{db_name}' établie avec succès.")

    # Créer un curseur pour exécuter des requêtes SQL
    cursor = conn.cursor()

    # Création des tables (si elles n'existent pas)
    print("Création des tables...")

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS monster_type (
        id INTEGER PRIMARY KEY,
        type_name TEXT NOT NULL
    )
    ''')
    cursor.executemany('''
    INSERT OR IGNORE INTO monster_type (id, type_name) VALUES (?, ?)
    ''', [(1, 'Attaque'), (2, 'Support'), (3, 'Défense'), (4, 'Pv')])

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS monster_elements (
        id INTEGER PRIMARY KEY,
        element_name TEXT NOT NULL
    )
    ''')
    cursor.executemany('''
    INSERT OR IGNORE INTO monster_elements (id, element_name) VALUES (?, ?)
    ''', [(1, 'Vent'), (2, 'Feu'), (3, 'Eau'), (4, 'Lumière'), (5, 'Ténèbres')])

    # Exemple de récupération et gestion des champs
    fields = {'element': None}  # Exemple de données simulées
    element = safely_lower(fields.get('element', ''))
    print(f"Élément transformé : {element}")  # Debug

    # Suite du script
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS monster_status (
        monster_id NVARCHAR(255) PRIMARY KEY,
        name TEXT NOT NULL,
        eveil NVARCHAR(255),
        famille NVARCHAR(255),
        awaken_bonus TEXT,
        obtainable BOOLEAN,
        type_id INTEGER,
        element_id INTEGER,
        FOREIGN KEY (type_id) REFERENCES monster_type(id),
        FOREIGN KEY (element_id) REFERENCES monster_elements(id)
    )
    ''')

    # Autres tables et vue créées comme dans votre script original...

    # Liste des tables à vider
    tables_to_clear = [
        'monster_type', 'monster_elements', 'monster_status', 
        'stats', 'competence', 'posts', 'monster_skills'
    ]

    # Vider les tables après leur création
    print("Vidage des tables...")
    clear_tables(cursor, tables_to_clear)

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

