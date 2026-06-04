import React, { useState } from 'react'
import { Hero, About, Reviews, Contact, Footer } from './Sections.jsx'
import { ProductGrid } from './ProductGrid.jsx'

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'shop', label: 'Shop' },
  { id: 'about', label: 'About' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'contact', label: 'Contact' },
]

export default function App() {
  const [active, setActive] = useState('home')
  const [cart, setCart] = useState([])
  const [toast, setToast] = useState(null)

  const onAdd = (product) => {
    setCart(c => [...c, product])
    setToast(`✓ ${product.name} added to cart`)
    setTimeout(() => setToast(null), 2400)
  }

  const goTo = (id) => {
    setActive(id)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand" onClick={() => goTo('home')}>
          <div className="brand-mark">RB</div>
          <div className="brand-name">RETRO<span>BAY</span></div>
        </div>
        <div className="nav-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`nav-tab ${active === t.id ? 'active' : ''}`}
              onClick={() => goTo(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="nav-actions">
          <button className="cart-btn" aria-label="Cart">
            🛒 <span>Cart</span>
            {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </button>
        </div>
      </nav>

      <Hero />
      <ProductGrid onAdd={onAdd} />
      <About />
      <Reviews />
      <Contact />
      <Footer />

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
