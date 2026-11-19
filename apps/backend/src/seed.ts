import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { prisma } from './db.js'
import type { Brand, ProductType } from './generated/prisma/client.js'

type CatalogProduct = {
  id: string
  productType: ProductType
  color: string
  size: string
  availableQuantity: number
  brand: Brand
}

type CatalogPrice = {
  id: string
  productId: string
  pricePerUnit: number
  isCurrent: boolean
}

const catalogPath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../frontend/src/data/clothing.json',
)

const catalog = JSON.parse(readFileSync(catalogPath, 'utf8')) as {
  products: CatalogProduct[]
  prices: CatalogPrice[]
}

const purchaseItems = await prisma.purchaseItem.count()
if (purchaseItems > 0) {
  throw new Error('Purchase items already reference prices, so the catalog was not reseeded.')
}

await prisma.price.deleteMany()
await prisma.product.deleteMany()

await prisma.product.createMany({
  data: catalog.products.map((product) => ({
    id: product.id,
    productType: product.productType,
    color: product.color,
    size: product.size,
    availableQuantity: product.availableQuantity,
    brand: product.brand,
  })),
})

await prisma.price.createMany({
  data: catalog.prices.map((price) => ({
    id: price.id,
    productId: price.productId,
    pricePerUnit: price.pricePerUnit.toFixed(2),
    isCurrent: price.isCurrent,
  })),
})

const products = await prisma.product.count()
const prices = await prisma.price.count()
const currentPrices = await prisma.price.count({ where: { isCurrent: true } })

console.log(`Seeded ${products} products and ${prices} prices (${currentPrices} current).`)

await prisma.$disconnect()
