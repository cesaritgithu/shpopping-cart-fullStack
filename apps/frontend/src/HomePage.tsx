import { useState, type ChangeEvent } from 'react'
import clothing, { categoryFor, sizeOrder } from './data/clothing.ts'
import type { Category } from './types.ts'
import cargoPants from './assets/cargo-pants.jpg'
import tShirts from './assets/t-shirts.jpg'
import cargoShorts from './assets/cargo-shorts.jpg'
import socks from './assets/socks.jpg'
import './HomePage.css'

const categoryLabels: Record<Category, string> = {
  pants: 'Pants',
  't-shirt': 'T-Shirts',
  shorts: 'Shorts',
  socks: 'Socks',
}

const categories: Category[] = ['pants', 't-shirt', 'shorts', 'socks']

const sizes = [...new Set(clothing.map((item) => item.size))].sort(function (a, b) {
  return sizeOrder.indexOf(a) - sizeOrder.indexOf(b)
})

const featuredLooks = [
  { image: cargoPants, styleId: '8900000000044' },
  { image: tShirts, styleId: '8900000000001' },
  { image: cargoShorts, styleId: '8900000000086' },
  { image: socks, styleId: '8900000000121' },
].map(function (look) {
  const product = clothing.find(function (item) {
    return item.styleId === look.styleId
  })
  if (!product) {
    throw new Error('Missing product ' + look.styleId)
  }
  return { ...look, category: categoryFor(product.productType) }
})

function HomePage(props: { query: string; onOpenCategory: (category: Category) => void }) {
  const [category, setCategory] = useState('')
  const [size, setSize] = useState('')
  const [sort, setSort] = useState('featured')

  const q = props.query.trim().toLowerCase()
  const products = clothing.filter(function (item) {
    if (category && categoryFor(item.productType) !== category) return false
    if (size && item.size !== size) return false
    if (q && !(item.styleName + ' ' + item.brand + ' ' + item.color).toLowerCase().includes(q)) return false
    return true
  })

  if (sort === 'price-asc') {
    products.sort(function (a, b) {
      return a.pricePerUnit - b.pricePerUnit
    })
  }
  if (sort === 'price-desc') {
    products.sort(function (a, b) {
      return b.pricePerUnit - a.pricePerUnit
    })
  }
  if (sort === 'name') {
    products.sort(function (a, b) {
      return a.styleName.localeCompare(b.styleName)
    })
  }

  function handleSort(event: ChangeEvent<HTMLSelectElement>) {
    setSort(event.target.value)
  }

  function handleCategory(event: ChangeEvent<HTMLSelectElement>) {
    setCategory(event.target.value)
  }

  function handleSize(event: ChangeEvent<HTMLSelectElement>) {
    setSize(event.target.value)
  }

  return (
    <main id="shop" className="catalog">
      <h1>Shop All Styles</h1>

      <div className="filters">
        <label className="filter-pill">
          <span>Filter &amp; Sort</span>
          <select value={sort} onChange={handleSort}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </label>

        <label className="filter-pill">
          <span>Category</span>
          <select value={category} onChange={handleCategory}>
            <option value="">All</option>
            {categories.map(function (value) {
              return (
                <option key={value} value={value}>
                  {categoryLabels[value]}
                </option>
              )
            })}
          </select>
        </label>

        <label className="filter-pill">
          <span>Size</span>
          <select value={size} onChange={handleSize}>
            <option value="">All</option>
            {sizes.map(function (value) {
              return (
                <option key={value} value={value}>
                  {value}
                </option>
              )
            })}
          </select>
        </label>
      </div>

      <p className="results">{products.length} Results</p>

      <ul className="product-grid">
        {featuredLooks.map(function (look) {
          return (
            <li key={look.styleId}>
              <button
                type="button"
                className="product-card"
                onClick={function () {
                  props.onOpenCategory(look.category)
                }}
              >
                <div className="product-photo">
                  <img src={look.image} alt="" />
                </div>
                <p className="product-name">{categoryLabels[look.category]}</p>
              </button>
            </li>
          )
        })}
      </ul>
    </main>
  )
}

export default HomePage
