require("dotenv").config();
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
// SERVE FRONTEND STATIC FILES
// =====================================

const frontendPath = path.join(__dirname, "../frontend/assets");

// Serve static assets with automatic .html extension matching
app.use(express.static(frontendPath, { extensions: ["html", "htm"] }));

// Default Root Route
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "dashboard.html"));
});

// Fallback for HTML page routes without extension
app.get("/:page", (req, res, next) => {
    if (req.params.page.startsWith("api")) return next();
    const pageFile = path.join(frontendPath, `${req.params.page}.html`);
    res.sendFile(pageFile, (err) => {
        if (err) {
            res.sendFile(path.join(frontendPath, "dashboard.html"));
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
