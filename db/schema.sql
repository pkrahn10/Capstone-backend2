DROP TABLE IF EXISTS orders_products;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id serial PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  password text NOT NULL,
  UNIQUE (email)
);

CREATE TABLE products (
  id serial PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  price decimal NOT NULL
);

CREATE TABLE orders (
  id serial PRIMARY KEY,
  date date NOT NULL,
  note text,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE 
);

CREATE TABLE orders_products (
  order_id integer NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL,
  price_at_purchase decimal NOT NULL,
  PRIMARY KEY (order_id, product_id)
);

CREATE TABLE carts (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamp NOT NULL
);

CREATE TABLE cart_items (
  id serial PRIMARY KEY,
  cart_id integer NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL,
  added_at timestamp NOT NULL
);
