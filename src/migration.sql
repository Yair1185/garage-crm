CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  phone VARCHAR(20) UNIQUE,
  email VARCHAR(100) UNIQUE
);

CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  model VARCHAR(50),
  plate VARCHAR(20) UNIQUE
);

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  vehicle_id INTEGER REFERENCES vehicles(id),
  service VARCHAR(50),
  date DATE,
  status VARCHAR(20) DEFAULT 'scheduled'
);

CREATE TABLE blocked_days (
  id SERIAL PRIMARY KEY,
  date DATE UNIQUE
);

CREATE TABLE admin (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  password VARCHAR(200)
);
