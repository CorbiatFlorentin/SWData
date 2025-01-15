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
    cursor.execute("PRAGMA foreign_keys = OFF;")  # Désactive temporairement les clés étrangères
    for table in tables:
        if table_exists(cursor, table):
            cursor.execute(f"DELETE FROM {table};")
            print(f"Table '{table}' vidée.")
        else:
            print(f"Table '{table}' inexistante, sautée.")
    cursor.execute("PRAGMA foreign_keys = ON;")  # Réactive les clés étrangères

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

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS stats (
        monster_id NVARCHAR(255) PRIMARY KEY,
        hp INTEGER,
        attaque INTEGER,
        defense INTEGER,
        vitesse INTEGER,
        taux_crit DECIMAL(5,2),
        dommages_crit DECIMAL(5,2),
        resistance DECIMAL(5,2),
        precision DECIMAL(5,2),
        FOREIGN KEY (monster_id) REFERENCES monster_status(monster_id)
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS competence (
        monster_id NVARCHAR(255) PRIMARY KEY,
        sort1 NVARCHAR(255),
        sort1_img BLOB,
        sort2 NVARCHAR(255),
        sort2_img BLOB,
        sort3 NVARCHAR(255),
        sort3_img BLOB,
        FOREIGN KEY (monster_id) REFERENCES monster_status(monster_id)
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom NVARCHAR(255) NOT NULL,
        prenom NVARCHAR(255) NOT NULL,
        pseudo NVARCHAR(255) UNIQUE NOT NULL,
        email NVARCHAR(255) UNIQUE NOT NULL,
        date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
        mot_de_passe TEXT NOT NULL
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS posts (
        post_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS monster_skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        monster_id NVARCHAR(255) NOT NULL,
        skill_id INTEGER NOT NULL,
        FOREIGN KEY (monster_id) REFERENCES monster_status(monster_id)
    )
    ''')

    # Création de la vue de jointure
    cursor.execute('''
    CREATE VIEW IF NOT EXISTS monster_full_view AS
    SELECT ms.monster_id, ms.name, ms.eveil, ms.famille, ms.awaken_bonus, ms.obtainable,
           mt.type_name AS type, me.element_name AS element,
           st.hp, st.attaque, st.defense, st.vitesse, st.taux_crit, 
           st.dommages_crit, st.resistance, st.precision,
           comp.sort1, comp.sort1_img, comp.sort2, comp.sort2_img, 
           comp.sort3, comp.sort3_img
    FROM monster_status AS ms
    LEFT JOIN monster_type AS mt ON ms.type_id = mt.id
    LEFT JOIN monster_elements AS me ON ms.element_id = me.id
    LEFT JOIN stats AS st ON ms.monster_id = st.monster_id
    LEFT JOIN competence AS comp ON ms.monster_id = comp.monster_id
    ''')

    print("Tables et vue créées avec succès.")

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
