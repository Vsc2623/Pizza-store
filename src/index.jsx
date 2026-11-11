import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const pizzaData = [
  {
    name: "Focaccia",
    ingredients: "Bread with Italian olive oil and rosemary",
    price: 6,
    photoName: "pizzas/focaccia.jpg",
    soldOut: false,
    category: "vegetarian",
  },
  {
    name: "Pizza Margherita",
    ingredients: "Tomato and mozzarella",
    price: 10,
    photoName: "pizzas/margherita.jpg",
    soldOut: false,
    category: "vegetarian",
  },
  {
    name: "Pizza Spinaci",
    ingredients: "Tomato, mozzarella, spinach, and ricotta cheese",
    price: 12,
    photoName: "pizzas/spinaci.jpg",
    soldOut: false,
    category: "vegetarian",
  },
  {
    name: "Pizza Funghi",
    ingredients: "Tomato, mozzarella, mushrooms, and onion",
    price: 12,
    photoName: "pizzas/funghi.jpg",
    soldOut: false,
    category: "vegetarian",
  },
  {
    name: "Pizza Salamino",
    ingredients: "Tomato, mozzarella, and pepperoni",
    price: 15,
    photoName: "pizzas/salamino.jpg",
    soldOut: true,
    category: "non-vegetarian",
  },
  {
    name: "Pizza Prosciutto",
    ingredients: "Tomato, mozzarella, ham, arugula, and burrata cheese",
    price: 18,
    photoName: "pizzas/prosciutto.jpg",
    soldOut: false,
    category: "non-vegetarian",
  },
];

function App() {
  return (
    <div className="container">
      <Header />
      <Menu />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="header">
      <h1>Fast React Pizza Co.</h1>
    </header>
  );
}

function Menu() {
  const [filter, setFilter] = useState("all");

  const filteredPizzas = pizzaData.filter((pizza) => {
    if (filter === "all") return true;
    return pizza.category === filter;
  });

  return (
    <main className="menu">
      <h2>Our Menu</h2>

      <p>
        Authentic Italian cuisine. Fresh ingredients, delicious pizzas,
        straight from our stone oven.
      </p>

      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
          aria-pressed={filter === "all"}
        >
          All Pizzas
        </button>

        <button
          className={`filter-btn ${filter === "vegetarian" ? "active" : ""}`}
          onClick={() => setFilter("vegetarian")}
          aria-pressed={filter === "vegetarian"}
        >
          Vegetarian
        </button>

        <button
          className={`filter-btn ${filter === "non-vegetarian" ? "active" : ""}`}
          onClick={() => setFilter("non-vegetarian")}
          aria-pressed={filter === "non-vegetarian"}
        >
          Non-Vegetarian
        </button>
      </div>

      <p className="pizza-count">
        Showing {filteredPizzas.length} of {pizzaData.length} pizzas
      </p>

      {filteredPizzas.length > 0 ? (
        <ul className="pizzas">
          {filteredPizzas.map((pizza) => (
            <Pizza pizzaObj={pizza} key={pizza.name} />
          ))}
        </ul>
      ) : (
        <p>No pizzas available in this category.</p>
      )}
    </main>
  );
}

function Pizza({ pizzaObj }) {
  return (
    <li className={`pizza ${pizzaObj.soldOut ? "sold-out" : ""}`}>
      <img src={pizzaObj.photoName} alt={pizzaObj.name} />

      <div>
        <h3>{pizzaObj.name}</h3>
        <p>{pizzaObj.ingredients}</p>
        <span>
          {pizzaObj.soldOut ? "SOLD OUT" : `$${pizzaObj.price}`}
        </span>
        <small className="pizza-category">
          {pizzaObj.category === "vegetarian"
            ? "Vegetarian"
            : "Non-Vegetarian"}
        </small>
      </div>
    </li>
  );
}

function Footer() {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 24;
  const isOpen = hour >= openHour && hour < closeHour;

  return (
    <footer className="footer">
      {isOpen ? (
        <Order closeHour={closeHour} openHour={openHour} />
      ) : (
        <p>
          We're happy to welcome you between {openHour}:00 and {closeHour}:00.
        </p>
      )}
    </footer>
  );
}

function Order({ closeHour, openHour }) {
  return (
    <div className="order">
      <p>
        We're open from {openHour}:00 to {closeHour}:00. Come visit us or order
        online.
      </p>
      <button className="btn">Order</button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
