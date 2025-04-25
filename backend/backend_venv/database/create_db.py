import sqlite3, os, datetime

DB_PATH = "mydatabase.db"
print("📂", os.path.abspath(DB_PATH))

def table_exists(cur, name):
    cur.execute(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name=?;", (name,)
    )
    return cur.fetchone() is not None


def clear_tables(cur, names):
    cur.execute("PRAGMA foreign_keys = ON;")
    for tbl in names:
        if table_exists(cur, tbl):
            cur.execute(f"DELETE FROM {tbl};")
            print(f"  – vidée : {tbl}")
    cur.execute("PRAGMA foreign_keys = ON;")


################################################################################
conn = sqlite3.connect(DB_PATH)
print("✅ connexion SQLite OK")
cur = conn.cursor()

print("🛠  création / vérification des tables …")

# ─────────────────────────── référentiels ────────────────────────────
cur.executescript(
    """
CREATE TABLE IF NOT EXISTS elements (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS archetypes (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS leader_skills (
  id        INTEGER PRIMARY KEY,
  attribute TEXT,
  amount    INTEGER,
  area      TEXT,
  element   TEXT
);

CREATE TABLE IF NOT EXISTS monsters (
  id               INTEGER PRIMARY KEY,
  name             TEXT NOT NULL,
  bestiary_slug    TEXT UNIQUE NOT NULL,
  com2us_id        INTEGER UNIQUE NOT NULL,
  family_id        INTEGER,
  skill_group_id   INTEGER,
  image_filename   TEXT,
  element_id       INTEGER,
  archetype_id     INTEGER,
  base_stars       INTEGER,
  natural_stars    INTEGER,
  obtainable       BOOLEAN,
  can_awaken       BOOLEAN,
  awaken_level     INTEGER,
  awaken_bonus     TEXT,
  skill_ups_to_max INTEGER,
  leader_skill_id  INTEGER,
  base_hp          INTEGER,
  base_attack      INTEGER,
  base_defense     INTEGER,
  speed            INTEGER,
  crit_rate        INTEGER,
  crit_damage      INTEGER,
  resistance       INTEGER,
  accuracy         INTEGER,
  max_lvl_hp       INTEGER,
  max_lvl_attack   INTEGER,
  max_lvl_defense  INTEGER,
  awakens_from     INTEGER,
  awakens_to       INTEGER,
  FOREIGN KEY (element_id)      REFERENCES elements(id),
  FOREIGN KEY (archetype_id)    REFERENCES archetypes(id),
  FOREIGN KEY (leader_skill_id) REFERENCES leader_skills(id)
);

CREATE TABLE IF NOT EXISTS skills (
  id          INTEGER PRIMARY KEY,
  name        TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS monster_skills (
  monster_id INTEGER,
  skill_id   INTEGER,
  PRIMARY KEY (monster_id, skill_id),
  FOREIGN KEY (monster_id) REFERENCES monsters(id),
  FOREIGN KEY (skill_id)   REFERENCES skills(id)
);

CREATE TABLE IF NOT EXISTS users (
  user_id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nom            TEXT NOT NULL,
  prenom         TEXT NOT NULL,
  pseudo         TEXT NOT NULL,
  email          TEXT UNIQUE NOT NULL,
  mot_de_passe   TEXT NOT NULL,
  role           TEXT DEFAULT 'user' CHECK(role IN ('user','admin')),
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/* Référentiel tours */
CREATE TABLE IF NOT EXISTS towers (
  tower_id INTEGER PRIMARY KEY,
  name     TEXT NOT NULL
);

/* Teams (une par user × tour × index) */
CREATE TABLE IF NOT EXISTS teams (
  team_id   INTEGER PRIMARY KEY AUTOINCREMENT,
  tower_id  INTEGER NOT NULL,
  user_id   INTEGER NOT NULL,
  team_idx  INTEGER NOT NULL,               
  FOREIGN KEY (tower_id) REFERENCES towers(tower_id),
  FOREIGN KEY (user_id)  REFERENCES users(user_id),
  UNIQUE (user_id, tower_id, team_idx)
);

/* Slots (3 monstres max) */
CREATE TABLE IF NOT EXISTS team_slots (
  team_id    INTEGER,
  slot_idx   INTEGER,                      
  monster_id INTEGER,
  PRIMARY KEY (team_id, slot_idx),
  FOREIGN KEY (team_id)   REFERENCES teams(team_id)   ON DELETE CASCADE,
  FOREIGN KEY (monster_id)REFERENCES monsters(id)
);
"""
)

# ─────────────────────────── vidage contrôlé ──────────────────────────
print("🧹 vidage des tables examples / ref …")
clear_tables(
    cur,
    [
        "team_slots",
        "teams",
        "towers",
        "users",
        "elements",
        "archetypes",
        "monsters",
        "skills",
        "monster_skills",
        "leader_skills",
    ],
)

# ─────────────────────────── seeds de base ────────────────────────────
cur.executemany("INSERT OR IGNORE INTO elements (name) VALUES (?)",
                [("Fire",), ("Water",), ("Wind",), ("Light",), ("Dark",)])

cur.executemany("INSERT OR IGNORE INTO archetypes (name) VALUES (?)",
                [("Attack",), ("Defense",), ("Support",), ("HP",)])

cur.executemany(
    "INSERT OR IGNORE INTO towers (tower_id, name) VALUES (?,?)",
    [(i, f"Tour {i}") for i in range(1, 13)],
)

conn.commit()
print("✅ schéma & seeds OK")
conn.close()
print("🔒 connexion fermée")
