import sqlite3
import os

# Nom du fichier SQLite
db_name = 'mydatabase.db'

# Créer une connexion à la base de données (ou créer le fichier s'il n'existe pas)
conn = sqlite3.connect(db_name)

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

# Fermer la connexion
conn.close()

print(f"Base de données '{db_name}' créée avec succès.")
