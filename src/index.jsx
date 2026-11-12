import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const pizzas = [
  { id: "margherita", name: "Margherita Classic", description: "San Marzano tomato, mozzarella, fresh basil", price: 249, image: "/pizzas/margherita.jpg", category: "veg", tag: "Bestseller" },
  { id: "spinaci", name: "Garden Spinaci", description: "Baby spinach, ricotta, mozzarella, tomato", price: 329, image: "/pizzas/spinaci.jpg", category: "veg", tag: "Fresh pick" },
  { id: "funghi", name: "Wild Mushroom", description: "Roasted mushrooms, onion, mozzarella, herbs", price: 349, image: "/pizzas/funghi.jpg", category: "veg", tag: "Chef's choice" },
  { id: "focaccia", name: "Rosemary Focaccia", description: "Olive oil, rosemary, sea salt", price: 179, image: "/pizzas/focaccia.jpg", category: "veg", tag: "Light bite" },
  { id: "salamino", name: "Spicy Salamino", description: "Spicy salami, mozzarella, rich tomato sauce", price: 389, image: "/pizzas/salamino.jpg", category: "nonveg", tag: "Spicy" },
  { id: "prosciutto", name: "Prosciutto Verde", description: "Smoked ham, arugula, burrata, mozzarella", price: 429, image: "/pizzas/prosciutto.jpg", category: "nonveg", tag: "Premium" },
];
const sizes = [{ name: "Regular", factor: 1 }, { name: "Medium", factor: 1.35 }, { name: "Large", factor: 1.7 }];
const toppings = [{ name: "Extra cheese", price: 40 }, { name: "Jalapeños", price: 25 }, { name: "Olives", price: 30 }, { name: "Mushrooms", price: 35 }];
const money = (value) => `₹${Math.round(value)}`;

function App() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [customizing, setCustomizing] = useState(null);
  const [size, setSize] = useState("Regular");
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const visiblePizzas = useMemo(() => pizzas.filter((pizza) => {
    const categoryMatch = category === "all" || pizza.category === category;
    const searchMatch = `${pizza.name} ${pizza.description}`.toLowerCase().includes(search.toLowerCase());
    return categoryMatch && searchMatch;
  }), [category, search]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function openCustomizer(pizza) {
    setCustomizing(pizza);
    setSize("Regular");
    setSelectedToppings([]);
  }
  function addToCart() {
    const chosenSize = sizes.find((item) => item.name === size);
    const toppingCost = selectedToppings.reduce((sum, name) => sum + toppings.find((t) => t.name === name).price, 0);
    const unitPrice = Math.round(customizing.price * chosenSize.factor + toppingCost);
    const key = `${customizing.id}-${size}-${selectedToppings.slice().sort().join("-")}`;
    setCart((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) return current.map((item) => item.key === key ? { ...item, quantity: item.quantity + 1 } : item);
      return [...current, { key, id: customizing.id, name: customizing.name, size, toppings: [...selectedToppings], price: unitPrice, quantity: 1 }];
    });
    setCustomizing(null);
    setNotice("Added to your cart");
    window.setTimeout(() => setNotice(""), 2200);
  }
  function changeQuantity(key, delta) {
    setCart((current) => current.map((item) => item.key === key ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0));
  }

  return <div className="app-shell">
    <div className="announcement">FRESH FROM OUR OVEN · FREE DELIVERY ON ORDERS ABOVE ₹499</div>
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Crust & Co home"><span className="brand-mark">C</span><span>CRUST<span className="brand-amp">&</span>CO.<small>GOOD TIMES. GREAT PIZZA.</small></span></a>
      <nav className="main-nav"><a href="#menu">Our menu</a><a href="#offers">Offers</a><a href="#why-us">Why us</a></nav>
      <button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${cartCount} items`}><span>🛒</span> Cart <b>{cartCount}</b></button>
    </header>

    <main id="home">
      <section className="hero">
        <div className="hero-copy"><span className="eyebrow">HAND-TOSSED · OVEN-FRESH · MADE WITH LOVE</span><h1>A little slice<br/>of <em>happiness.</em></h1><p>Big flavour, fresh ingredients and a golden, crispy crust. Your next favourite pizza is just a few clicks away.</p><a className="primary-button" href="#menu">Explore the menu <span>→</span></a><div className="hero-proof"><span>★★★★★</span><small>Loved by pizza people everywhere</small></div></div>
        <div className="hero-art"><div className="hero-circle"></div><img src="/pizzas/margherita.jpg" alt="Fresh Margherita pizza"/><div className="hero-sticker">MADE<br/>FRESH<br/><b>FOR YOU</b></div><div className="hero-note">100%<br/><b>GOOD</b><br/>MOOD</div></div>
      </section>

      <section className="offer-strip" id="offers"><div className="offer-icon">✦</div><div><b>THE MORE, THE MERRIER</b><span>Get free delivery on orders above ₹499</span></div><a href="#menu">Build your box ↗</a></section>

      <section className="menu-section" id="menu"><div className="section-heading"><div><span className="eyebrow">MADE WITH THE GOOD STUFF</span><h2>Find your <em>perfect pizza.</em></h2></div><p>Classic comfort or a little adventure? We've got a slice for every kind of craving.</p></div>
        <div className="menu-tools"><div className="filters" aria-label="Filter pizzas"><button className={category === "all" ? "filter active" : "filter"} onClick={() => setCategory("all")}>All pizzas</button><button className={category === "veg" ? "filter active" : "filter"} onClick={() => setCategory("veg")}>🟢 Vegetarian</button><button className={category === "nonveg" ? "filter active" : "filter"} onClick={() => setCategory("nonveg")}>🔴 Non-veg</button></div><label className="search-box"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find your favourite..." aria-label="Search pizzas"/></label></div>
        <div className="pizza-grid">{visiblePizzas.map((pizza) => <article className="pizza-card" key={pizza.id}><div className="pizza-photo"><img src={pizza.image} alt={pizza.name}/><span className="pizza-tag">{pizza.tag}</span></div><div className="pizza-info"><div className="pizza-title-row"><h3>{pizza.name}</h3><span className={pizza.category === "veg" ? "food-dot veg-dot" : "food-dot nonveg-dot"}></span></div><p>{pizza.description}</p><div className="pizza-card-bottom"><strong>{money(pizza.price)} <small> onwards</small></strong><button className="add-button" onClick={() => openCustomizer(pizza)}>Customize +</button></div></div></article>)}</div>
        {visiblePizzas.length === 0 && <p className="empty-state">No pizzas match that search. Try another name.</p>}
      </section>

      <section className="why-section" id="why-us"><div><span className="eyebrow">THE CRUST & CO. PROMISE</span><h2>Good ingredients.<br/><em>Great memories.</em></h2></div><div className="promise-grid"><div><span>🌿</span><b>Fresh ingredients</b><p>Thoughtfully chosen ingredients in every bite.</p></div><div><span>🔥</span><b>Oven-fresh always</b><p>Prepared fresh when you place your order.</p></div><div><span>💛</span><b>Made with care</b><p>Good food, warm service, happy moments.</p></div></div></section>
    </main>

    <footer className="site-footer"><a className="brand footer-brand" href="#home"><span className="brand-mark">C</span><span>CRUST<span className="brand-amp">&</span>CO.<small>GOOD TIMES. GREAT PIZZA.</small></span></a><p>Freshly made. Happily shared.</p><span>© {new Date().getFullYear()} Crust & Co. Demo ordering experience.</span></footer>

    {customizing && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCustomizing(null); }}><section className="custom-modal" role="dialog" aria-modal="true" aria-labelledby="custom-title"><button className="modal-close" onClick={() => setCustomizing(null)} aria-label="Close">×</button><span className="eyebrow">MAKE IT YOURS</span><h2 id="custom-title">{customizing.name}</h2><p className="modal-description">{customizing.description}</p><h3>Choose your size</h3><div className="size-options">{sizes.map((item) => <button key={item.name} className={size === item.name ? "size-option selected" : "size-option"} onClick={() => setSize(item.name)}><b>{item.name}</b><span>{money(customizing.price * item.factor)}</span></button>)}</div><h3>Make it extra special</h3><div className="topping-list">{toppings.map((topping) => <label key={topping.name}><span><input type="checkbox" checked={selectedToppings.includes(topping.name)} onChange={(event) => setSelectedToppings((current) => event.target.checked ? [...current, topping.name] : current.filter((name) => name !== topping.name))}/>{topping.name}</span><b>+{money(topping.price)}</b></label>)}</div><button className="primary-button modal-add" onClick={addToCart}>Add to cart · {money(customizing.price * sizes.find((item) => item.name === size).factor + selectedToppings.reduce((sum, name) => sum + toppings.find((t) => t.name === name).price, 0))}</button></section></div>}

    {cartOpen && <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}><aside className="cart-drawer" aria-label="Shopping cart"><div className="drawer-heading"><div><span className="eyebrow">YOUR ORDER</span><h2>Your cart <span>({cartCount})</span></h2></div><button className="modal-close" onClick={() => setCartOpen(false)} aria-label="Close cart">×</button></div>{cart.length === 0 ? <div className="cart-empty"><span>🍕</span><h3>Your cart is looking a little empty.</h3><p>Find a pizza that makes you smile.</p><button className="primary-button" onClick={() => setCartOpen(false)}>Explore menu</button></div> : <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.key}><div><b>{item.name}</b><span>{item.size}{item.toppings.length ? ` · ${item.toppings.join(", ")}` : ""}</span><strong>{money(item.price * item.quantity)}</strong></div><div className="quantity-control"><button onClick={() => changeQuantity(item.key, -1)} aria-label="Decrease quantity">−</button><b>{item.quantity}</b><button onClick={() => changeQuantity(item.key, 1)} aria-label="Increase quantity">+</button></div></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><b>{money(cartTotal)}</b></div><div><span>Delivery</span><b>{cartTotal >= 499 ? "FREE" : "Calculated at checkout"}</b></div><p>{cartTotal >= 499 ? "You've unlocked free delivery!" : `Add ${money(499 - cartTotal)} more for free delivery.`}</p><button className="primary-button checkout-button" onClick={() => setNotice("Checkout will be added in Phase 2.")}>Continue to checkout <span>→</span></button></div></>}</aside></div>}
    {notice && <div className="toast" role="status">{notice}</div>}
  </div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
