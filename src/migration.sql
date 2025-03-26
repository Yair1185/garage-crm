DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS blocked_days;
DROP TABLE IF EXISTS admin;

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL
);

CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  plate TEXT UNIQUE NOT NULL
);

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  vehicle_id INT REFERENCES vehicles(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  service_type VARCHAR(50),
  status VARCHAR(20) DEFAULT '?????'
);

CREATE TABLE blocked_days (
  id SERIAL PRIMARY KEY,
  date DATE UNIQUE NOT NULL
);

CREATE TABLE admin (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);
