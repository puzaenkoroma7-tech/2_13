const express = require("express");
const router = express.Router();
const userModel = require("../data/users");

const generateToken = id => `fake-jwt-${id}-${Date.now()}`;

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Токен не надано" });

  const user = userModel.verifyToken(token);
  if (!user) return res.status(401).json({ message: "Невірний токен" });

  req.user = user;
  next();
};

router.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "Заповніть всі поля" });

  if (userModel.findByEmail(email))
    return res.status(400).json({ message: "Email вже існує" });

  const user = userModel.create({ username, email, password });
  const token = generateToken(user.id);
  userModel.saveToken(user.id, token);

  res.status(201).json({ token, user });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = userModel.findByEmail(email);

  if (!user || !userModel.checkPassword(user, password))
    return res.status(401).json({ message: "Невірні дані" });

  const token = generateToken(user.id);
  userModel.saveToken(user.id, token);

  const { password: _, ...safe } = user;
  res.json({ token, user: safe });
});

router.get("/profile", authenticateToken, (req, res) => {
  res.json(req.user);
});

router.get("/users", authenticateToken, (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Недостатньо прав" });

  res.json(userModel.getAll());
});

module.exports = router;
