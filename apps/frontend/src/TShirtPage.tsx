import { useState } from 'react'
import clothing, { preferredVariant, sortSizes, stylesOf } from './data/clothing.ts'
import ProductDetail from './ProductDetail.tsx'
import type { BagItem } from './types.ts'
import teeWhiteWorn from './assets/t-shirts.jpg'
import teeWhiteHanger from './assets/tee-white-2.png'
import teeWhiteDetail from './assets/tee-white-3.png'
import teeWhiteBack from './assets/tee-white-4.png'
import teeBlackHanger from './assets/tee-black-plain.png'
import teeBlackWorn from './assets/tee-black-2.png'
import teeBlackBack from './assets/tee-black-3.png'
import teeBlackDetail from './assets/tee-black-4.png'
import teeNavyHanger from './assets/tee-navy-1.png'
import teeNavyWorn from './assets/tee-navy-2.png'
import teeNavyDetail from './assets/tee-navy-3.png'
import teeNavyBack from './assets/tee-navy-4.png'
import vneckWhite1 from './assets/vneck-white-1.png'
import vneckWhite2 from './assets/vneck-white-2.png'
import vneckWhite3 from './assets/vneck-white-3.png'
import vneckWhite4 from './assets/vneck-white-4.png'
import vneckBlush1 from './assets/vneck-blush-1.png'
import vneckBlush2 from './assets/vneck-blush-2.png'
import vneckSky1 from './assets/vneck-sky-1.png'
import vneckSky2 from './assets/vneck-sky-2.png'

const tees = clothing.filter((item) => item.productType === 'Shirts')
const teeStyles = stylesOf(tees)

const colorHex: Record<string, string> = {
  White: '#f3f1ea',
  Black: '#161616',
  Navy: '#1b2a4a',
  Charcoal: '#4a4a4a',
  'Forest Green': '#2f4a33',
  Blush: '#e4b7b0',
  'Sky Blue': '#8fb8d6',
  'Heather Gray': '#b8b8b8',
  Olive: '#6b6a3d',
  Sand: '#cbb79b',
  Stone: '#c5bba8',
  'Royal Blue': '#2a4d9b',
  'Neon Lime': '#b6e14a',
  Natural: '#e8dcc4',
  Sage: '#8fa37a',
  Terracotta: '#c46a43',
  Burgundy: '#6d2430',
  Cream: '#efe6d4',
  'Butter Yellow': '#f0d56a',
  Lavender: '#c5b4d6',
  'Faded Black': '#2c2c2c',
  'Washed Red': '#b85a4e',
  'Army Green': '#4d5b3a',
  Ivory: '#f4f0e4',
  Red: '#b42318',
  Graphite: '#3a3a3a',
  Rainbow: '#e07a5f',
  'Blue Swirl': '#6ea8c9',
  Sunset: '#e07b4a',
  Chocolate: '#5b3a29',
  Rust: '#b65a2a',
  'Electric Blue': '#2f6fed',
  Mint: '#b7d7c4',
  Khaki: '#c4b07a',
  Mustard: '#d4a017',
  Clay: '#c07a5a',
  Tan: '#c8a46a',
  'Washed White': '#f2efe8',
  Gray: '#8a8a8a',
  Yellow: '#e6c200',
  Indigo: '#2c3d7a',
}

const colorGalleries: Record<string, string[]> = {
  White: [teeWhiteWorn, teeWhiteHanger, teeWhiteDetail, teeWhiteBack],
  Black: [teeBlackHanger, teeBlackWorn, teeBlackBack, teeBlackDetail],
  Navy: [teeNavyHanger, teeNavyWorn, teeNavyDetail, teeNavyBack],
}

const styleGalleries: Record<string, Record<string, string[]>> = {
  '8900000000003': {
    White: [vneckWhite1, vneckWhite2, vneckWhite3, vneckWhite4],
    Blush: [vneckBlush1, vneckBlush2],
    'Sky Blue': [vneckSky1, vneckSky2],
  },
}

function galleryFor(color: string) {
  const gallery = colorGalleries[color]
  if (gallery) return gallery
  if (color.toLowerCase().includes('black')) return colorGalleries.Black ?? []
  if (color.toLowerCase().includes('navy')) return colorGalleries.Navy ?? []
  return colorGalleries.White ?? []
}

function galleriesFor(styleId: string, colors: string[]) {
  const styleGallery = styleGalleries[styleId]
  if (styleGallery) return styleGallery
  return Object.fromEntries(colors.map((color) => [color, galleryFor(color)]))
}

function TShirtPage(props: { onBack: () => void; onAddToBag: (item: BagItem) => void }) {
  const [styleId, setStyleId] = useState(teeStyles[0].styleId)
  const [variantId, setVariantId] = useState(preferredVariant(tees.filter((item) => item.styleId === teeStyles[0].styleId), 'M').id)
  const variants = tees.filter((item) => item.styleId === styleId)
  const product = variants.find((item) => item.id === variantId) ?? preferredVariant(variants, 'M')
  const colors = [...new Set(variants.map((item) => item.color))]

  function selectStyle(nextStyleId: string) {
    const nextVariants = tees.filter((item) => item.styleId === nextStyleId)
    setStyleId(nextStyleId)
    setVariantId(preferredVariant(nextVariants, 'M').id)
  }

  return (
    <ProductDetail
      key={product.styleId}
      product={product}
      variants={variants}
      title={product.styleName}
      crumb="T-shirts"
      styleOptions={teeStyles}
      onStyleChange={selectStyle}
      onVariantChange={setVariantId}
      colorHex={colorHex}
      colorGalleries={galleriesFor(product.styleId, colors)}
      copy={[
        'Our everyday essential tee.',
        'In a soft cotton jersey.',
        'Cut with a classic fit.',
      ]}
      extraDetails={[
        [
          'Size & fit',
          'Available sizes: ' +
            sortSizes([...new Set(variants.map((item) => item.size))]).join(', ') +
            '. Regular sits at the hip; Tall adds extra length.',
        ],
        ['Fabric & care', 'Soft cotton jersey. Machine wash cold, tumble dry low.'],
      ]}
      onBack={props.onBack}
      onAddToBag={props.onAddToBag}
    />
  )
}

export default TShirtPage
