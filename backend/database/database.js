const { Pool } = require("pg");

// =====================================
// SUPABASE POSTGRESQL CONNECTION
// =====================================

if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set");
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    ssl: {
        rejectUnauthorized: false
    },

    max: 10,

    idleTimeoutMillis: 30000,

    connectionTimeoutMillis: 10000
});

// =====================================
// TEST DATABASE CONNECTION
// =====================================

pool.connect()
    .then(client => {

        console.log("✅ Supabase PostgreSQL Connected");

        client.release();

        createTables();

    })
    .catch(err => {

        console.error(
            "❌ PostgreSQL connection failed:",
            err.message
        );

        process.exit(1);
    });


// =====================================
// CREATE TABLES
// =====================================

async function createTables() {

    try {

        // ---------------------------------
        // Restaurants
        // ---------------------------------

        await pool.query(`
            CREATE TABLE IF NOT EXISTS restaurants (

                id SERIAL PRIMARY KEY,

                name TEXT NOT NULL,

                owner_name TEXT,

                mobile TEXT,

                address TEXT,

                status TEXT DEFAULT 'Active',

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);


        // ---------------------------------
        // Brands
        // ---------------------------------

        await pool.query(`
            CREATE TABLE IF NOT EXISTS brands (

                id SERIAL PRIMARY KEY,

                restaurant_id INTEGER NOT NULL,

                position INTEGER NOT NULL,

                brand_name TEXT,

                short_name TEXT NOT NULL,

                item_code TEXT NOT NULL,

                category TEXT,

                size TEXT,

                status TEXT DEFAULT 'Active',

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                CONSTRAINT fk_brand_restaurant

                    FOREIGN KEY (restaurant_id)

                    REFERENCES restaurants(id)

                    ON DELETE CASCADE
            )
        `);


        // ---------------------------------
        // Default Restaurant
        // ---------------------------------

        await pool.query(`
            INSERT INTO restaurants
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

            ON CONFLICT (id) DO NOTHING
        `);


        // ---------------------------------
        // Sequence Fix
        // ---------------------------------

        await pool.query(`
            SELECT setval(
                pg_get_serial_sequence('restaurants', 'id'),
                COALESCE(
                    (SELECT MAX(id) FROM restaurants),
                    1
                )
            )
        `);


        console.log("✅ PostgreSQL Tables Ready");

    }

    catch (error) {

        console.error(
            "❌ Table creation error:",
            error.message
        );

    }
}


// =====================================
// EXPORT
// =====================================

module.exports = pool;