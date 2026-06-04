import React from 'react'
import { HeroStage } from './three/Models.jsx'
import { reviews, timeline } from './data.js'

const features = [
  { icon: '⚡', title: 'Hand-tested', desc: 'Each unit is bench-tested for 8+ hours by our technicians before listing.' },
  { icon: '🔋', title: 'Recapped PSU', desc: 'All electrolytic capacitors replaced with quality Japanese components.' },
  { icon: '📦', title: 'Safe shipping', desc: 'Double-boxed with custom foam. Insurance included on every order worldwide.' },
  { icon: '🛡️', title: '12-month warranty', desc: 'Every machine ships with a 12-month RTB warranty on the mainboard and PSU.' },
]

export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-text">
        <span className="hero-tag">
          <span className="dot"></span>
          47 machines in stock · ships in 24h
        </span>
        <h1>
          Vintage <span className="accent">computers</span><br />
          for the <span className="accent2">next generation</span><br />
          of collectors.
        </h1>
        <p className="lead">
          RETROBAY is the marketplace for restored classics from the golden age of personal computing.
          Every Amiga, Mac, C64 and Atari we sell has been recapped, tested, and brought back to its
          factory glory by people who actually used them the first time.
        </p>
        <div className="hero-buttons">
          <a href="#shop" className="btn btn-primary">▸ Browse catalog</a>
          <a href="#about" className="btn btn-ghost">Our story →</a>
        </div>
        <div className="hero-stats">
          <div>
            <div className="stat-num">3.2K+</div>
            <div className="stat-label">Machines sold</div>
          </div>
          <div>
            <div className="stat-num">47</div>
            <div className="stat-label">In stock</div>
          </div>
          <div>
            <div className="stat-num">98%</div>
            <div className="stat-label">Satisfaction</div>
          </div>
          <div>
            <div className="stat-num">12y</div>
            <div className="stat-label">In business</div>
          </div>
        </div>
      </div>
      <div className="hero-canvas">
        <div className="hero-canvas-badge">● LIVE · 3D SHOWCASE</div>
        <HeroStage />
        <div className="hero-canvas-hint">drag to <b>rotate</b> · scroll to <b>zoom</b></div>
      </div>
    </section>
  )
}

export function About() {
  return (
    <section className="section" id="about">
      <div className="section-head">
        <div>
          <span className="section-tag">// ABOUT</span>
          <h2 className="section-title">Why <em>RETROBAY</em>?</h2>
          <p className="section-sub">We were there the first time. We're doing it properly the second time.</p>
        </div>
      </div>
      <div className="features">
        {features.map(f => (
          <div key={f.title} className="feature">
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 60 }}>
        <span className="section-tag">// TIMELINE</span>
        <h3 className="section-title" style={{ fontSize: 24 }}>The <em>era</em> we restore</h3>
        <div className="timeline">
          {timeline.map(t => (
            <div key={t.year} className="timeline-item">
              <div className="timeline-year">{t.year}</div>
              <h4 className="timeline-name">{t.name}</h4>
              <p className="timeline-desc">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Reviews() {
  return (
    <section className="section" id="reviews">
      <div className="section-head">
        <div>
          <span className="section-tag">// REVIEWS</span>
          <h2 className="section-title">What <em>collectors</em> say</h2>
          <p className="section-sub">4.9 / 5 average across 1,200+ verified purchases.</p>
        </div>
      </div>
      <div className="reviews">
        {reviews.map(r => (
          <div key={r.name} className="review">
            <div className="review-stars">{'★'.repeat(r.rating)}</div>
            <p className="review-text">{r.text}</p>
            <div className="review-author">
              <div className="review-avatar">{r.name[0]}</div>
              <div>
                <div className="review-name">{r.name}</div>
                <div className="review-meta">{r.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', topic: 'general', message: '' })
  const onSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setForm({ name: '', email: '', topic: 'general', message: '' })
    }, 3200)
  }
  return (
    <section className="section" id="contact">
      <div className="section-head">
        <div>
          <span className="section-tag">// CONTACT</span>
          <h2 className="section-title">Get in <em>touch</em></h2>
          <p className="section-sub">Looking for something specific? We source hard-to-find machines on request.</p>
        </div>
      </div>
      <div className="contact-grid">
        <div className="contact-info">
          <div className="contact-item">
            <div className="contact-icon">⌂</div>
            <div>
              <div className="contact-label">Lab & showroom</div>
              <div className="contact-value">Via Tortona 27, 20144 Milano, IT</div>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">✉</div>
            <div>
              <div className="contact-label">Email</div>
              <div className="contact-value">hello@retrobay.shop</div>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">☎</div>
            <div>
              <div className="contact-label">Phone</div>
              <div className="contact-value">+39 02 4040 8080</div>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">◷</div>
            <div>
              <div className="contact-label">Showroom hours</div>
              <div className="contact-value">Tue–Sat · 10:00 – 19:00 CET</div>
            </div>
          </div>
        </div>

        <form className="form" onSubmit={onSubmit}>
          {sent && <div className="form-success">✓ MESSAGE SENT · we reply within 24h</div>}
          <div className="form-row">
            <div>
              <label>Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div>
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
          </div>
          <div>
            <label>Topic</label>
            <select value={form.topic} onChange={e => setForm({...form, topic: e.target.value})}>
              <option value="general">General question</option>
              <option value="sourcing">Custom sourcing</option>
              <option value="repair">Repair / service</option>
              <option value="trade">Trade-in my machine</option>
              <option value="press">Press / collaboration</option>
            </select>
          </div>
          <div>
            <label>Message</label>
            <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} required />
          </div>
          <button className="btn btn-primary" type="submit">▸ Send message</button>
        </form>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <div className="brand" style={{ cursor: 'default' }}>
          <div className="brand-mark">RB</div>
          <div className="brand-name">RETRO<span>BAY</span></div>
        </div>
        <p>The marketplace for vintage computers. Restored by enthusiasts, sold with warranty, shipped worldwide from Milano since 2014.</p>
      </div>
      <div className="footer-col">
        <h4>Shop</h4>
        <a href="#shop">All machines</a>
        <a href="#shop">Apple</a>
        <a href="#shop">Commodore</a>
        <a href="#shop">Atari</a>
        <a href="#shop">IBM &amp; clones</a>
      </div>
      <div className="footer-col">
        <h4>Service</h4>
        <a href="#contact">Repair</a>
        <a href="#contact">Custom sourcing</a>
        <a href="#contact">Trade-in</a>
        <a href="#contact">Wholesale</a>
      </div>
      <div className="footer-col">
        <h4>About</h4>
        <a href="#about">Our story</a>
        <a href="#reviews">Reviews</a>
        <a href="#contact">Contact</a>
        <a href="#contact">Press kit</a>
      </div>
      <div className="footer-bottom">
        <div>© 2026 RETROBAY · Via Tortona 27, Milano · P.IVA 09182340159</div>
        <div>v 1.0.0 · built with care · retro 4 ever</div>
      </div>
    </footer>
  )
}
