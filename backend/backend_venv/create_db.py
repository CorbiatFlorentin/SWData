import sqlite3

# Nom du fichier SQLite
db_name = 'mydatabase.db'

try:
    # Créer une connexion à la base de données (ou créer le fichier s'il n'existe pas)
    conn = sqlite3.connect(db_name)
    print(f"Connexion à la base de données '{db_name}' établie avec succès.")

    # Créer un curseur pour exécuter des requêtes SQL
    cursor = conn.cursor()

    # Création des tables de base (type, élément, statut, statistiques, compétence, utilisateur)
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
        eveil NVARCHAR(255),
        famille NVARCHAR(255),
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
        sort4 NVARCHAR(255),
        sort4_img BLOB,
        passif NVARCHAR(255),
        passif_img BLOB,
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

    # Création de la table de jointure pour visualiser toutes les informations du monstre
    cursor.execute('''
    CREATE VIEW IF NOT EXISTS monster_full_view AS
    SELECT ms.monster_id, ms.eveil, ms.famille, 
           mt.type_name AS type, me.element_name AS element,
           st.hp, st.attaque, st.defense, st.vitesse, st.taux_crit, 
           st.dommages_crit, st.resistance, st.precision,
           comp.sort1, comp.sort1_img, comp.sort2, comp.sort2_img, 
           comp.sort3, comp.sort3_img, comp.sort4, comp.sort4_img, 
           comp.passif, comp.passif_img
    FROM monster_status AS ms
    LEFT JOIN monster_type AS mt ON ms.type_id = mt.id
    LEFT JOIN monster_elements AS me ON ms.element_id = me.id
    LEFT JOIN stats AS st ON ms.monster_id = st.monster_id
    LEFT JOIN competence AS comp ON ms.monster_id = comp.monster_id
    ''')

    conn.commit()
    print("Tables et vue de jointure créées avec succès.")

except sqlite3.Error as e:
    print(f"Erreur lors de la connexion à la base de données : {e}")

finally:
    # Fermer la connexion
    if conn:
        conn.close()
        print("Connexion fermée.")



