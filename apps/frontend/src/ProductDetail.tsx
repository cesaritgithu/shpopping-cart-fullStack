import { useState, type ChangeEvent, type CSSProperties } from 'react'
import { sortSizes } from './data/clothing.ts'
import type { BagItem, DetailSection, Product, StyleOption } from './types.ts'
import './TShirtPage.css'

function swatchStyle(name: string, colorHex: Record<string, string>): CSSProperties {
  const hex = colorHex[name]
  if (hex) return { background: hex }

  if (name.includes('/')) {
    const parts = name.split('/')
    return {
      background:
        'linear-gradient(135deg, ' +
        (colorHex[parts[0]] || '#ccc') +
        ' 50%, ' +
        (colorHex[parts[1]] || '#999') +
        ' 50%)',
    }
  }

  return { background: '#c8c8c8' }
}

function uniqueColors(variants: Product[]) {
  const colors: string[] = []
  for (const variant of variants) {
    if (!colors.includes(variant.color)) colors.push(variant.color)
  }
  return colors
}

function ProductDetail(props: {
  product: Product
  variants: Product[]
  title: string
  crumb: string
  styleOptions?: StyleOption[]
  onStyleChange: (styleId: string) => void
  onVariantChange: (productId: string) => void
  colorHex: Record<string, string>
  colorGalleries: Record<string, string[]>
  copy: string[]
  extraDetails: DetailSection[]
  onBack: () => void
  onAddToBag: (item: BagItem) => void
}) {
  const [fit, setFit] = useState('Regular')
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [openSection, setOpenSection] = useState('')

  const color = props.product.color
  const size = props.product.size
  const unitPrice = props.product.pricePerUnit
  const listPrice = Math.round((unitPrice / 0.8) * 100) / 100
  const colors = uniqueColors(props.variants)
  const sizes = sortSizes(
    props.variants.filter((variant) => variant.color === color).map((variant) => variant.size),
  )
  const gallery = props.colorGalleries[color] ?? props.colorGalleries[colors[0]] ?? []
  const qtyMax = Math.min(props.product.availableQuantity, 8)
  const quantity = Math.min(selectedQuantity, Math.max(qtyMax, 1))
  const qtyOptions = []
  for (let n = 1; n <= qtyMax; n++) {
    qtyOptions.push(n)
  }

  function chooseColor(nextColor: string) {
    const match =
      props.variants.find((variant) => variant.color === nextColor && variant.size === size) ??
      props.variants.find((variant) => variant.color === nextColor)
    if (match) props.onVariantChange(match.id)
  }

  function chooseSize(nextSize: string) {
    const match = props.variants.find((variant) => variant.color === color && variant.size === nextSize)
    if (match) props.onVariantChange(match.id)
  }

  function handleAddToBag() {
    props.onAddToBag({
      barcode: props.product.id,
      name: props.product.brand + ' ' + props.product.styleName,
      color: props.product.color,
      fit: fit,
      size: props.product.size,
      quantity: quantity,
      price: unitPrice,
    })
    setAdded(true)
    window.setTimeout(function () {
      setAdded(false)
    }, 1800)
  }

  function handleStyleChange(event: ChangeEvent<HTMLSelectElement>) {
    props.onStyleChange(event.target.value)
  }

  function handleQuantity(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedQuantity(Number(event.target.value))
  }

  const sections: DetailSection[] = [
    [
      'Product details',
      props.product.brand +
        ' ' +
        props.product.styleName +
        '. Barcode ' +
        props.product.id +
        '. ' +
        props.product.availableQuantity +
        ' in stock.',
    ],
    ...props.extraDetails,
    ['Shipping & returns', 'Free shipping on orders over $50. Free returns within 30 days.'],
  ]

  return (
    <main className="pdp">
      <nav className="pdp-crumb" aria-label="Breadcrumb">
        <button type="button" onClick={props.onBack}>
          Men
        </button>
        <span>/</span>
        <span>{props.crumb}</span>
      </nav>

      <div className="pdp-layout">
        <section className="pdp-gallery" aria-label="Product photos">
          {gallery.map(function (src, index) {
            return (
              <img
                key={src}
                src={src}
                alt={color + ' ' + props.title + ' view ' + (index + 1)}
              />
            )
          })}
        </section>

        <section className="pdp-info">
          <h1>{props.title}</h1>
          <p className="pdp-label">{props.product.brand}</p>

          {props.styleOptions && (
            <div className="pdp-block pdp-block-first">
              <p className="pdp-label">Style</p>
              <select
                className="style-select"
                value={props.product.styleId}
                onChange={handleStyleChange}
              >
                {props.styleOptions.map(function (style) {
                  return (
                    <option key={style.styleId} value={style.styleId}>
                      {style.brand} · {style.styleName}
                    </option>
                  )
                })}
              </select>
            </div>
          )}

          <div className="pdp-price-row">
            <div>
              <p className="pdp-price">
                <s>${listPrice.toFixed(2)}</s>
                <strong>${unitPrice.toFixed(2)}</strong>
              </p>
              <p className="pdp-sale">20% off: limited time</p>
              <p className="pdp-stock">{props.product.availableQuantity} available</p>
            </div>
            <p className="pdp-rating" aria-label="4.5 out of 5 stars">
              <span aria-hidden="true">★★★★☆</span> 128 ratings
            </p>
          </div>

          <div className="pdp-block">
            <p className="pdp-label">Color {color}</p>
            <div className="swatches">
              {colors.map(function (name) {
                return (
                  <button
                    key={name}
                    type="button"
                    className={name === color ? 'swatch is-selected' : 'swatch'}
                    style={swatchStyle(name, props.colorHex)}
                    aria-label={name}
                    onClick={function () {
                      chooseColor(name)
                    }}
                  />
                )
              })}
            </div>
          </div>

          <div className="pdp-block">
            <p className="pdp-label">Fit</p>
            <div className="choice-row">
              {['Regular', 'Tall'].map(function (option) {
                return (
                  <button
                    key={option}
                    type="button"
                    className={option === fit ? 'choice is-selected' : 'choice'}
                    onClick={function () {
                      setFit(option)
                    }}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="pdp-block">
            <div className="pdp-label-row">
              <p className="pdp-label">Size</p>
              <button type="button" className="text-link">
                Size Guide
              </button>
            </div>
            <div className="choice-row size-row">
              {sizes.map(function (option) {
                return (
                  <button
                    key={option}
                    type="button"
                    className={option === size ? 'choice is-selected' : 'choice'}
                    onClick={function () {
                      chooseSize(option)
                    }}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="pdp-actions">
            <label className="qty">
              <span className="sr-only">Quantity</span>
              <select value={quantity} onChange={handleQuantity}>
                {qtyOptions.map(function (n) {
                  return (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  )
                })}
              </select>
            </label>
            <button type="button" className="add-bag" onClick={handleAddToBag}>
              {added ? 'Added to Bag' : 'Add to Bag'}
            </button>
          </div>

          <div className="pdp-boxes">
            <p>Free shipping on $50+. Sign in or join now.</p>
            <p>In-store pickup available. Change store.</p>
          </div>

          <div className="pdp-copy">
            {props.copy.map(function (line) {
              return <p key={line}>{line}</p>
            })}
          </div>

          {sections.map(function (section) {
            const sectionTitle = section[0]
            const body = section[1]
            return (
              <div key={sectionTitle} className="pdp-acc">
                <button
                  type="button"
                  onClick={function () {
                    setOpenSection(openSection === sectionTitle ? '' : sectionTitle)
                  }}
                >
                  {sectionTitle}
                  <span aria-hidden="true">{openSection === sectionTitle ? '−' : '›'}</span>
                </button>
                {openSection === sectionTitle && <p>{body}</p>}
              </div>
            )
          })}
        </section>
      </div>
    </main>
  )
}

export default ProductDetail
