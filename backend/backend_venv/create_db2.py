import sqlite3

# Nom du fichier SQLite
db_name = 'mydatabase.db'

try:
    # Créer une connexion à la base de données (ou créer le fichier s'il n'existe pas)
    conn = sqlite3.connect(db_name)
    print(f"Connexion à la base de données '{db_name}' établie avec succès.")

    # Créer un curseur pour exécuter des requêtes SQL
    cursor = conn.cursor()

    # Création des tables de base
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

    # Renommage de monster_status en monster et intégration des stats
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS monster (
        id NVARCHAR(255) PRIMARY KEY,
        eveil NVARCHAR(255),
        famille NVARCHAR(255),
        type_id INTEGER,
        element_id INTEGER,
        hp INTEGER,
        attaque INTEGER,
        defense INTEGER,
        vitesse INTEGER,
        taux_crit DECIMAL(5,2),
        dommages_crit DECIMAL(5,2),
        resistance DECIMAL(5,2),
        precision DECIMAL(5,2),
        FOREIGN KEY (type_id) REFERENCES monster_type(id),
        FOREIGN KEY (element_id) REFERENCES monster_elements(id)
    )
    ''')

    # Transformer stats en une vue
    cursor.execute('''
    CREATE VIEW IF NOT EXISTS monster_stats_view AS
    SELECT 
        id AS monster_id,
        hp, attaque, defense, vitesse, 
        taux_crit, dommages_crit, resistance, precision
    FROM monster
    ''')

    # Table d'association entre monster et competence
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS monster_competence (
        monster_id NVARCHAR(255),
        competence_id INTEGER PRIMARY KEY AUTOINCREMENT,
        sort NVARCHAR(255),
        sort_img BLOB,
        passif NVARCHAR(255),
        passif_img BLOB,
        FOREIGN KEY (monster_id) REFERENCES monster(id)
    )
    ''')

    # Table pour les utilisateurs
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

    # Table posts pour les commentaires sur des combinaisons de monstres
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS posts (
        post_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        monster1_id NVARCHAR(255) NOT NULL,
        monster2_id NVARCHAR(255) NOT NULL,
        monster3_id NVARCHAR(255) NOT NULL,
        commentaire TEXT NOT NULL,
        strategy TEXT NOT NULL,
        upvotes INTEGER DEFAULT 0,
        downvotes INTEGER DEFAULT 0,
        date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (monster1_id) REFERENCES monster(id),
        FOREIGN KEY (monster2_id) REFERENCES monster(id),
        FOREIGN KEY (monster3_id) REFERENCES monster(id)
    )
    ''')

    # Table pour les votes (suivi des votes des utilisateurs)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS votes (
        vote_id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        vote_type TEXT CHECK(vote_type IN ('upvote', 'downvote')) NOT NULL,
        date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_id, user_id), -- Un utilisateur ne peut voter qu'une seule fois par post
        FOREIGN KEY (post_id) REFERENCES posts(post_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
    ''')

    # Création de la vue complète pour les posts avec les informations détaillées
    cursor.execute('''
    CREATE VIEW IF NOT EXISTS post_full_view AS
    SELECT 
        p.post_id,
        u.pseudo AS user_pseudo,
        p.monster1_id,
        p.monster2_id,
        p.monster3_id,
        p.commentaire,
        p.strategy,
        p.upvotes,
        p.downvotes,
        p.date_creation
    FROM posts AS p
    LEFT JOIN users AS u ON p.user_id = u.user_id
    ''')

    # Création de la vue complète pour les monstres
    cursor.execute('''
    CREATE VIEW IF NOT EXISTS monster_full_view AS
    SELECT m.id AS monster_id, m.eveil, m.famille, 
           mt.type_name AS type, me.element_name AS element,
           m.hp, m.attaque, m.defense, m.vitesse, m.taux_crit, 
           m.dommages_crit, m.resistance, m.precision,
           mc.sort, mc.sort_img, mc.passif, mc.passif_img
    FROM monster AS m
    LEFT JOIN monster_type AS mt ON m.type_id = mt.id
    LEFT JOIN monster_elements AS me ON m.element_id = me.id
    LEFT JOIN monster_competence AS mc ON m.id = mc.monster_id
    ''')

    conn.commit()
    print("Tables et vues créées avec succès.")

except sqlite3.Error as e:
    print(f"Erreur lors de la connexion à la base de données : {e}")

finally:
    # Fermer la connexion
    if conn:
        conn.close()
        print("Connexion fermée.")
