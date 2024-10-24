import sqlite3
import os

# Nom du fichier SQLite
db_name = 'mydatabase.db'

try:
    # Créer une connexion à la base de données (ou créer le fichier s'il n'existe pas)
    conn = sqlite3.connect(db_name)
    print(f"Connexion à la base de données '{db_name}' établie avec succès.")

    # Créer un curseur pour exécuter des requêtes SQL
    cursor = conn.cursor()

    # Exemple de création d'une table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_url TEXT NOT NULL,
        description TEXT
    )
    ''')

    # Valider les changements
    conn.commit()

except sqlite3.Error as e:
    print(f"Erreur lors de la connexion à la base de données : {e}")

finally:
    # Fermer la connexion
    if conn:
        conn.close()
        print("Connexion fermée.")

