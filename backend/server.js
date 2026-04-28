const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

// 🌍 Load environment variables
dotenv.config();

// 🗄️ Connect MongoDB
connectDB();

const app = express();

// 🛡️ Middleware
app.use(cors());
app.use(express.json());

// 🚀 Routes
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/user",
  require("./routes/userRoutes")
);

app.use(
  "/api/health",
  require("./routes/healthRoutes")
);

// 🧠 Hybrid Rule-Based + AI Dynamic Triage Routes
app.use(
  "/api/triage",
  require("./routes/triageRoutes")
);

// 🌐 Root Check
app.get("/", (req, res) =>
  res.send(
    "HealthAI API Running Successfully 🚀"
  )
);

// ⚠️ 404 Handler
app.use((req, res) => {
  res.status(404).json({
    msg: "Route not found"
  });
});

// 🔥 Global Error Handler
app.use(
  (err, req, res, next) => {
    console.error(
      "Server Error:",
      err.stack
    );

    res.status(500).json({
      msg:
        "Internal Server Error"
    });
  }
);

// 🚀 Start Server
const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    `🌐 Server running on http://localhost:${PORT}`
  )
);