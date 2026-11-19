export type Category = 'pants' | 't-shirt' | 'shorts' | 'socks'

export type Page = 'home' | 'bag' | Category

export type ProductType = 'Pants' | 'Shorts' | 'Shirts' | 'Socks'

export type Brand = 'Nike' | 'Adidas' | 'Tommy'

export type Product = {
  id: string
  productType: ProductType
  color: string
  size: string
  availableQuantity: number
  brand: Brand
  styleName: string
  styleId: string
  pricePerUnit: number
}

export type StyleOption = {
  styleId: string
  styleName: string
  brand: Brand
}

export type BagItem = {
  barcode: string
  name: string
  color: string
  fit: string
  size: string
  quantity: number
  price: number
}

export type DetailSection = [title: string, body: string]
