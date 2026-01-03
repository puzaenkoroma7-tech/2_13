// src/data/products.js

let products = [
  {
    id: 1,
    name: "Ноутбук Dell XPS 13",
    description: "Потужний ультрабук з екраном 13 дюймів",
    price: 45000,
    category: "electronics",
    inStock: true,
    quantity: 15,
    createdBy: 1,
    createdAt: "2024-01-05T09:00:00Z"
  },
  {
    id: 2,
    name: "Смартфон iPhone 15",
    description: "Флагманський смартфон від Apple",
    price: 55000,
    category: "electronics",
    inStock: true,
    quantity: 25,
    createdBy: 2,
    createdAt: "2024-01-06T10:30:00Z"
  }
];

const productModel = {
  getAll: (filters = {}) => {
    let result = [...products];

    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }

    if (filters.inStock !== undefined) {
      result = result.filter(p => p.inStock === (filters.inStock === "true"));
    }

    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s)
      );
    }

    if (filters.sort) {
      if (filters.sort === "price_asc") result.sort((a, b) => a.price - b.price);
      if (filters.sort === "price_desc") result.sort((a, b) => b.price - a.price);
      if (filters.sort === "newest")
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      if (filters.sort === "oldest")
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const start = (page - 1) * limit;
    const end = page * limit;

    return {
      products: result.slice(start, end),
      total: result.length,
      page,
      totalPages: Math.ceil(result.length / limit),
      hasNextPage: end < result.length,
      hasPrevPage: start > 0
    };
  },

  findById: id => products.find(p => p.id === Number(id)),

  create: data => {
    const id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const product = {
      id,
      ...data,
      createdAt: new Date().toISOString()
    };
    products.push(product);
    return product;
  },

  update: (id, data) => {
    const index = products.findIndex(p => p.id === Number(id));
    if (index === -1) return null;
    products[index] = { ...products[index], ...data };
    return products[index];
  },

  delete: id => {
    const index = products.findIndex(p => p.id === Number(id));
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  },

  getByUser: userId =>
    products.filter(p => p.createdBy === Number(userId))
};

module.exports = productModel;
