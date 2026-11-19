import raw from './clothing.json'
import type { Category, Product, ProductType, StyleOption } from '../types.ts'

type CatalogProduct = Omit<Product, 'pricePerUnit'>

type CatalogPrice = {
  id: string
  productId: string
  pricePerUnit: number
  isCurrent: boolean
}

const catalog = raw as {
  products: CatalogProduct[]
  prices: CatalogPrice[]
}

const currentPrice = new Map(
  catalog.prices
    .filter((price) => price.isCurrent)
    .map((price) => [price.productId, price.pricePerUnit]),
)

const clothing: Product[] = catalog.products.map((product) => {
  const pricePerUnit = currentPrice.get(product.id)
  if (pricePerUnit === undefined) {
    throw new Error('Missing current price for ' + product.id)
  }
  return { ...product, pricePerUnit }
})

export default clothing

export const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '26', '28', '30', '32', '34', '36', '38']

export function categoryFor(productType: ProductType): Category {
  switch (productType) {
    case 'Shirts':
      return 't-shirt'
    case 'Pants':
      return 'pants'
    case 'Shorts':
      return 'shorts'
    case 'Socks':
      return 'socks'
  }
}

export function stylesOf(products: Product[]): StyleOption[] {
  const styles: StyleOption[] = []
  const seen = new Set<string>()
  for (const product of products) {
    if (seen.has(product.styleId)) continue
    seen.add(product.styleId)
    styles.push({
      styleId: product.styleId,
      styleName: product.styleName,
      brand: product.brand,
    })
  }
  return styles
}

export function preferredVariant(variants: Product[], preferredSize: string): Product {
  return variants.find((variant) => variant.size === preferredSize) ?? variants[0]
}

export function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((left, right) => {
    const leftIndex = sizeOrder.indexOf(left)
    const rightIndex = sizeOrder.indexOf(right)
    return (leftIndex === -1 ? sizeOrder.length : leftIndex) - (rightIndex === -1 ? sizeOrder.length : rightIndex)
  })
}
