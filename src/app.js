const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "REST API працює" });
});

app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    uptime: process.uptime(),
    time: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// 404 (Express 5)
app.use((req, res) => {
  res.status(404).json({ message: "Маршрут не знайдено" });
});

app.listen(5000, () => {
  console.log("Сервер запущено: http://localhost:5000");
});
