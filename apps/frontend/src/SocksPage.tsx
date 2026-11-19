import { useState } from 'react'
import clothing, { preferredVariant, sortSizes, stylesOf } from './data/clothing.ts'
import ProductDetail from './ProductDetail.tsx'
import type { BagItem } from './types.ts'
import socksBlack1 from './assets/socks-black-1.png'
import socksBlack2 from './assets/socks-black-2.png'
import socksWhite1 from './assets/socks-white-1.png'
import socksWhite2 from './assets/socks-white-2.png'
import socksGray1 from './assets/socks-gray-1.png'
import socksGray2 from './assets/socks-gray-2.png'

const socks = clothing.filter((item) => item.productType === 'Socks')
const sockStyles = stylesOf(socks)

const colorHex: Record<string, string> = {
  White: '#f3f1ea',
  Black: '#161616',
  Navy: '#1b2a4a',
  Charcoal: '#4a4a4a',
  Olive: '#6b6a3d',
  Burgundy: '#6d2430',
  Gray: '#8a8a8a',
  Beige: '#d8c9a8',
  'Royal Blue': '#2a4d9b',
  Rainbow: '#e07a5f',
  'Striped Multi': '#6ea8c9',
  'Argyle Navy': '#1b2a4a',
  'Polka Dot Red': '#b42318',
  'Dino Green': '#4d5b3a',
  'Space Blue': '#2c3d7a',
}

const colorGalleries: Record<string, string[]> = {
  Black: [socksBlack1, socksBlack2],
  White: [socksWhite1, socksWhite2],
  Gray: [socksGray1, socksGray2],
}

function galleryFor(color: string) {
  const gallery = colorGalleries[color]
  if (gallery) return gallery
  const name = color.toLowerCase()
  if (name.includes('white') || name.includes('beige') || name.includes('rainbow')) {
    return colorGalleries.White ?? []
  }
  if (name.includes('gray') || name.includes('charcoal') || name.includes('olive')) {
    return colorGalleries.Gray ?? []
  }
  return colorGalleries.Black ?? []
}

function galleriesFor(colors: string[]) {
  return Object.fromEntries(colors.map((color) => [color, galleryFor(color)]))
}

function SocksPage(props: { onBack: () => void; onAddToBag: (item: BagItem) => void }) {
  const [styleId, setStyleId] = useState('8900000000121')
  const [variantId, setVariantId] = useState(
    preferredVariant(socks.filter((item) => item.styleId === '8900000000121'), 'M').id,
  )
  const variants = socks.filter((item) => item.styleId === styleId)
  const product = variants.find((item) => item.id === variantId) ?? preferredVariant(variants, 'M')
  const colors = [...new Set(variants.map((item) => item.color))]

  function selectStyle(nextStyleId: string) {
    const nextVariants = socks.filter((item) => item.styleId === nextStyleId)
    setStyleId(nextStyleId)
    setVariantId(preferredVariant(nextVariants, 'M').id)
  }

  return (
    <ProductDetail
      key={product.styleId}
      product={product}
      variants={variants}
      title={product.styleName}
      crumb="Socks"
      styleOptions={sockStyles}
      onStyleChange={selectStyle}
      onVariantChange={setVariantId}
      colorHex={colorHex}
      colorGalleries={galleriesFor(colors)}
      copy={[
        'Everyday crew socks in a 3-pack.',
        'Soft knit cotton blend.',
        'Cushioned sole with a stay-up cuff.',
      ]}
      extraDetails={[
        [
          'Size & fit',
          'Available sizes: ' +
            sortSizes([...new Set(variants.map((item) => item.size))]).join(', ') +
            '. Regular crew height; Tall adds extra cuff length.',
        ],
        ['Fabric & care', 'Cotton blend. Machine wash warm, tumble dry low.'],
      ]}
      onBack={props.onBack}
      onAddToBag={props.onAddToBag}
    />
  )
}

export default SocksPage
