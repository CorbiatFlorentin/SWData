import sqlite3

# Nom du fichier SQLite
db_name = 'mydatabase.db'

try:
    # Créer une connexion à la base de données (ou créer le fichier s'il n'existe pas)
    conn = sqlite3.connect(db_name)
    print(f"Connexion à la base de données '{db_name}' établie avec succès.")

    # Créer un curseur pour exécuter des requêtes SQL
    cursor = conn.cursor()

    # Création de la table monster_type
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS monster_type (
        id INTEGER PRIMARY KEY,
        type_name TEXT NOT NULL
    )
    ''')

    # Insertion des valeurs pour monster_type
    cursor.executemany('''
    INSERT OR IGNORE INTO monster_type (id, type_name) VALUES (?, ?)
    ''', [(1, 'Attaque'), (2, 'Support'), (3, 'Défense'), (4, 'Pv')])

    # Création de la table monster_elements
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS monster_elements (
        id INTEGER PRIMARY KEY,
        element_name TEXT NOT NULL
    )
    ''')

    # Insertion des valeurs pour monster_elements
    cursor.executemany('''
    INSERT OR IGNORE INTO monster_elements (id, element_name) VALUES (?, ?)
    ''', [(1, 'Vent'), (2, 'Feu'), (3, 'Eau'), (4, 'Lumière'), (5, 'Ténèbres')])

    # Création de la table monster_status
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS monster_status (
        monster_id NVARCHAR(255) PRIMARY KEY,
        eveil NVARCHAR(255),
        famille NVARCHAR(255),
        type_id INTEGER,
        element_id INTEGER,
        FOREIGN KEY (type_id) REFERENCES monster_type(id),
        FOREIGN KEY (element_id) REFERENCES monster_elements(id)
    )
    ''')

    # Création de la table Stats
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

    # Création de la table Compétence avec colonnes d'image associées
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS competence (
        monster_id NVARCHAR(255) PRIMARY KEY,
        sort1 NVARCHAR(255),
        sort1_img BLOB,
        sort2 NVARCHAR(255),
        sort2_img BLOB,
        sort3 NVARCHAR(255),
        sort3_img BLOB,
        sort4 NVARCHAR(255),
        sort4_img BLOB,
        passif NVARCHAR(255),
        passif_img BLOB,
        FOREIGN KEY (monster_id) REFERENCES monster_status(monster_id)
    )
    ''')

    # Valider les changements
    conn.commit()
    print("Tables créées avec succès.")

except sqlite3.Error as e:
    print(f"Erreur lors de la connexion à la base de données : {e}")

finally:
    # Fermer la connexion
    if conn:
        conn.close()
        print("Connexion fermée.")


