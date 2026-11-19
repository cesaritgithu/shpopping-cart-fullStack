import { useState } from 'react'
import type { BagItem } from './types.ts'
import './BagPage.css'

const TAX_RATE = 0.06

function money(amount: number) {
  return `$${amount.toFixed(2)}`
}

function BagPage(props: { bag: BagItem[]; onBack: () => void; onPayNow: () => void }) {
  const [paid, setPaid] = useState(false)

  const subtotal = props.bag.reduce(function (sum, item) {
    return sum + item.price * item.quantity
  }, 0)
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100
  const total = Math.round((subtotal + tax) * 100) / 100

  function handlePayNow() {
    setPaid(true)
    props.onPayNow()
  }

  if (paid) {
    return (
      <main className="bag">
        <nav className="bag-crumb" aria-label="Breadcrumb">
          <button type="button" onClick={props.onBack}>
            Men
          </button>
          <span>/</span>
          <span>Bag</span>
        </nav>
        <h1>Bag</h1>
        <div className="bag-done">
          <p>Thanks for your order.</p>
          <button type="button" className="bag-btn bag-btn-secondary" onClick={props.onBack}>
            Continue Shopping
          </button>
        </div>
      </main>
    )
  }

  if (props.bag.length === 0) {
    return (
      <main className="bag">
        <nav className="bag-crumb" aria-label="Breadcrumb">
          <button type="button" onClick={props.onBack}>
            Men
          </button>
          <span>/</span>
          <span>Bag</span>
        </nav>
        <h1>Bag</h1>
        <div className="bag-done">
          <p className="bag-empty">Your bag is empty.</p>
          <button type="button" className="bag-btn bag-btn-secondary" onClick={props.onBack}>
            Continue Shopping
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="bag">
      <nav className="bag-crumb" aria-label="Breadcrumb">
        <button type="button" onClick={props.onBack}>
          Men
        </button>
        <span>/</span>
        <span>Bag</span>
      </nav>

      <h1>Bag</h1>

      <div className="bag-layout">
        <ul className="bag-list">
          {props.bag.map(function (item, index) {
            return (
              <li key={item.barcode + '-' + item.color + '-' + item.size + '-' + index}>
                <div>
                  <p className="bag-item-name">{item.name}</p>
                  <p className="bag-item-meta">
                    {item.color} · {item.fit} · Size {item.size}
                  </p>
                </div>
                <p className="bag-item-price">
                  {money(item.price)} × {item.quantity} = {money(item.price * item.quantity)}
                </p>
              </li>
            )
          })}
        </ul>

        <aside className="bag-summary">
          <h2>Order summary</h2>
          <p>
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </p>
          <p>
            <span>Tax (6%)</span>
            <span>{money(tax)}</span>
          </p>
          <p className="bag-total">
            <span>Total</span>
            <span>{money(total)}</span>
          </p>
          <div className="bag-actions">
            <button type="button" className="bag-btn bag-btn-primary" onClick={handlePayNow}>
              Pay Now
            </button>
            <button type="button" className="bag-btn bag-btn-secondary" onClick={props.onBack}>
              Continue Shopping
            </button>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default BagPage
