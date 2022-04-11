const path = require("path");
const dishes = require(path.resolve("src/data/dishes-data"));
const nextId = require("../utils/nextId");
// middleware
function hasRequiredFields(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const requiredFields = ['name', 'description', 'price', 'image_url'];
  for (const field of requiredFields) {
    if (!req.body.data[field]) {
      next({ status: 400, message: `A '${field}' property is required.` });
    }
  }
  next();
}
// middleware
function validatePrice(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  if (typeof price !== 'number') {
    return res.status(400).json({ error: 'price must be a number' });
  }
  if (price < 0) {
    return res.status(400).json({ error: 'price must be a number greater than zero' });
  }
  next();
}
// middleware
function dishExists(req, res, next) {
  const dishId = req.params.dishId;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) { 
    res.locals.dish = foundDish
    return next();
  }
  next({
    status: 404,
    message: `dish id not found: ${req.params.dishId}`,
  });
}
//middleware
function validateId(req, res, next) {
  const dishId = req.params.dishId;
  const { data: { id } } = req.body
  if(id) {
      if (dishId !== id) {
      next({
        status: 400,
        message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
      });
    }
  }
  next();
}

function list(req, res) {
  res.json({ data: dishes });
}

function create(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const newName = {
    id: nextId(),
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newName);
  res.status(201).json({ data: newName });
}

function read(req, res) {
  res.json({ data: res.locals.dish });
}

function update(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const updatedDish = {
    ...res.locals.dish,
    name,
    description,
    price,
    image_url,
  };
  res.json({ data: updatedDish });
}

module.exports = {
  list,
  create: [hasRequiredFields, validatePrice, create],
  read: [dishExists, read],
  update: [dishExists, hasRequiredFields, validatePrice, validateId, update],
}