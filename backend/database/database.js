const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "govstock.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
        return;
    }

    console.log("✅ SQLite Connected");

    db.serialize(() => {

        // Enable Foreign Keys
        db.run("PRAGMA foreign_keys = ON;");

        // -------------------------
        // Restaurants Table
        // -------------------------
        db.run(`
            CREATE TABLE IF NOT EXISTS restaurants (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                owner_name TEXT,
                mobile TEXT,
                address TEXT,
                status TEXT DEFAULT 'Active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error("❌ Restaurants table error:", err.message);
            }
        });

        // -------------------------
        // Brands Table
        // -------------------------
        db.run(`
            CREATE TABLE IF NOT EXISTS brands (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                restaurant_id INTEGER NOT NULL,

                position INTEGER NOT NULL,

                brand_name TEXT,

                short_name TEXT NOT NULL,

                item_code TEXT NOT NULL,

                category TEXT,

                size TEXT,

                status TEXT DEFAULT 'Active',

                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (restaurant_id)
                    REFERENCES restaurants(id)
                    ON DELETE CASCADE
            )
        `, (err) => {
            if (err) {
                console.error("❌ Brands table error:", err.message);
            }
        });

        // =====================================


        // -------------------------
        // Default Restaurant
        // -------------------------
        db.run(`
            INSERT OR IGNORE INTO restaurants
            (
                id,
                name,
                owner_name,
                mobile,
                address,
                status
            )
            VALUES
            (
                1,
                'Default Restaurant',
                '',
                '',
                '',
                'Active'
            )
        `, (err) => {
            if (err) {
                console.error("❌ Default restaurant insert error:", err.message);
            }
        });

        console.log("✅ Tables Ready");
    });
});

module.exports = db;