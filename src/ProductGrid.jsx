import React, { useState } from 'react'
import { products, categories } from './data.js'
import { ProductThumb } from './three/Models.jsx'

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="product-card">
      <div className="product-thumb">
        {product.tag && <span className={`product-tag ${product.tag}`}>{product.tag.toUpperCase()}</span>}
        <ProductThumb product={product} />
      </div>
      <div className="product-info">
        <div className="product-eyebrow">{product.eyebrow}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.desc}</p>
        <div className="product-footer">
          <div className="product-price">
            <span className="currency">€</span>{product.price}
            {product.oldPrice && <span className="old">€{product.oldPrice}</span>}
          </div>
          <button className="add-btn" onClick={() => onAdd(product)}>+ ADD</button>
        </div>
      </div>
    </div>
  )
}

export function ProductGrid({ onAdd }) {
  const [activeCat, setActiveCat] = useState('all')
  const filtered = activeCat === 'all' ? products : products.filter(p => p.category === activeCat)

  return (
    <section className="section" id="shop">
      <div className="section-head">
        <div>
          <span className="section-tag">// CATALOG</span>
          <h2 className="section-title">Our <em>collection</em></h2>
          <p className="section-sub">Every machine is hand-tested, recapped, and shipped from our lab in Milan.</p>
        </div>
        <div className="nav-tabs" style={{ flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button
              key={c.id}
              className={`nav-tab ${activeCat === c.id ? 'active' : ''}`}
              onClick={() => setActiveCat(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <div className="product-grid">
        {filtered.map(p => <ProductCard key={p.id} product={p} onAdd={onAdd} />)}
      </div>
    </section>
  )
}
