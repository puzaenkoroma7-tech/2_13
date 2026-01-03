const express = require("express");
const router = express.Router();
const productModel = require("../data/products");
const userModel = require("../data/users");

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const user = userModel.verifyToken(token);
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  req.user = user;
  next();
};

router.get("/", (req, res) => {
  res.json(productModel.getAll(req.query));
});

router.get("/user/my-products", auth, (req, res) => {
  res.json(productModel.getByUser(req.user.id));
});

router.get("/:id", (req, res) => {
  const product = productModel.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Не знайдено" });
  res.json(product);
});

router.post("/", auth, (req, res) => {
  const { name, description, price, category, quantity } = req.body;
  if (!name || !description || !price || !category)
    return res.status(400).json({ message: "Заповніть поля" });

  const q = quantity ? Number(quantity) : 0;

  const product = productModel.create({
    name,
    description,
    price: Number(price),
    category,
    quantity: q,
    inStock: q > 0,
    createdBy: req.user.id
  });

  res.status(201).json(product);
});

router.put("/:id", auth, (req, res) => {
  const product = productModel.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Не знайдено" });

  if (product.createdBy !== req.user.id && req.user.role !== "admin")
    return res.status(403).json({ message: "Недостатньо прав" });

  res.json(productModel.update(req.params.id, req.body));
});

router.delete("/:id", auth, (req, res) => {
  const product = productModel.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Не знайдено" });

  if (product.createdBy !== req.user.id && req.user.role !== "admin")
    return res.status(403).json({ message: "Недостатньо прав" });

  productModel.delete(req.params.id);
  res.json({ message: "Видалено" });
});

module.exports = router;
