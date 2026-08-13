const path = require("path");
const express = require("express");
const cors = require("cors");

const restaurantRoutes = require("./routes/restaurantRoutes");
const brandRoutes = require("./routes/brandRoutes");

// =====================================
// DATABASE INITIALIZE
// =====================================

require("./database/database");


// =====================================
// APP
// =====================================

const app = express();

const PORT = process.env.PORT || 3000;


// =====================================
// MIDDLEWARE
// =====================================

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());


// =====================================
// API ROUTES
// =====================================

// Restaurants
app.use(
    "/api/restaurants",
    restaurantRoutes
);

// Brands
app.use(
    "/api/brands",
    brandRoutes
);


// =====================================
// HEALTH & ROOT ROUTE
// =====================================

app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "🚀 Gov Stock Manager API Running"
    });
});


// =====================================
// SERVE FRONTEND STATIC FILES (IF AVAILABLE)
// =====================================

const frontendPath = path.join(__dirname, "../frontend/assets");
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "dashboard.html"), (err) => {
        if (err) {
            res.json({
                success: true,
                message: "🚀 Gov Stock Manager API Running"
            });
        }
    });
});


// =====================================
// 404 API ROUTE
// =====================================

app.use("/api/*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});


// =====================================
// START SERVER
// =====================================

app.listen(PORT, () => {
    console.log(
        `🚀 Server running on port ${PORT}`
    );
});