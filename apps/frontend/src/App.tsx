import { useState, type ChangeEvent } from 'react'
import type { BagItem, Page } from './types.ts'
import HomePage from './HomePage.tsx'
import TShirtPage from './TShirtPage.tsx'
import PantsPage from './PantsPage.tsx'
import ShortsPage from './ShortsPage.tsx'
import SocksPage from './SocksPage.tsx'
import BagPage from './BagPage.tsx'
import './App.css'

function App() {
  const [page, setPage] = useState<Page>('home')
  const [query, setQuery] = useState('')
  const [bag, setBag] = useState<BagItem[]>([])

  const bagCount = bag.reduce(function (sum, item) {
    return sum + item.quantity
  }, 0)

  function goHome() {
    setPage('home')
  }

  function openBag() {
    setPage('bag')
  }

  function addToBag(item: BagItem) {
    setBag(function (current) {
      return current.concat(item)
    })
  }

  function payNow() {
    setBag([])
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value)
  }

  return (
    <div className="store">
      <header className="topbar">
        <a
          className="logo"
          href="#shop"
          onClick={function (event) {
            event.preventDefault()
            goHome()
          }}
        >
          HAVEN
        </a>

        <div className="topbar-right">
          <label className="search">
            <span className="sr-only">Search</span>
            <input
              type="search"
              placeholder="Search"
              value={query}
              onChange={handleSearch}
            />
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </label>
          <button type="button" className="bag-count" onClick={openBag}>
            Bag ({bagCount})
          </button>
        </div>
      </header>

      {page === 'home' && <HomePage query={query} onOpenCategory={setPage} />}
      {page === 't-shirt' && <TShirtPage onBack={goHome} onAddToBag={addToBag} />}
      {page === 'pants' && <PantsPage onBack={goHome} onAddToBag={addToBag} />}
      {page === 'shorts' && <ShortsPage onBack={goHome} onAddToBag={addToBag} />}
      {page === 'socks' && <SocksPage onBack={goHome} onAddToBag={addToBag} />}
      {page === 'bag' && <BagPage bag={bag} onBack={goHome} onPayNow={payNow} />}
    </div>
  )
}

export default App
