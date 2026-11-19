import { useState } from 'react'
import clothing, { preferredVariant, sortSizes, stylesOf } from './data/clothing.ts'
import ProductDetail from './ProductDetail.tsx'
import type { BagItem } from './types.ts'
import shortsOlive1 from './assets/shorts-olive-1.png'
import shortsOlive2 from './assets/shorts-olive-2.png'
import shortsGray1 from './assets/shorts-gray-1.png'
import shortsGray2 from './assets/shorts-gray-2.png'
import shortsCoyote1 from './assets/shorts-coyote-1.png'
import shortsCoyote2 from './assets/shorts-coyote-2.png'

const shorts = clothing.filter((item) => item.productType === 'Shorts')
const shortStyles = stylesOf(shorts)

const colorHex: Record<string, string> = {
  White: '#f3f1ea',
  Black: '#161616',
  Navy: '#1b2a4a',
  'Forest Green': '#2f4a33',
  Olive: '#6b6a3d',
  Sand: '#cbb79b',
  Stone: '#c5bba8',
  Sage: '#8fa37a',
  Ivory: '#f4f0e4',
  Khaki: '#c4b07a',
  Gray: '#8a8a8a',
  'Heather Gray': '#b8b8b8',
  'Electric Blue': '#2f6fed',
  'Light Wash': '#9bb4d0',
  'Medium Wash': '#5a7aa8',
  'Coyote Brown': '#8a5a2b',
  Teal: '#2a7a78',
  'Sunset Orange': '#e07b4a',
  'Dusty Rose': '#c48a8a',
  Camel: '#c4a06a',
}

const colorGalleries: Record<string, string[]> = {
  Olive: [shortsOlive1, shortsOlive2],
  Gray: [shortsGray1, shortsGray2],
  'Coyote Brown': [shortsCoyote1, shortsCoyote2],
}

function galleryFor(color: string) {
  const gallery = colorGalleries[color]
  if (gallery) return gallery
  const name = color.toLowerCase()
  if (name.includes('gray') || name.includes('white') || name.includes('ivory') || name.includes('wash')) {
    return colorGalleries.Gray ?? []
  }
  if (name.includes('brown') || name.includes('sand') || name.includes('camel') || name.includes('khaki') || name.includes('orange')) {
    return colorGalleries['Coyote Brown'] ?? []
  }
  return colorGalleries.Olive ?? []
}

function galleriesFor(colors: string[]) {
  return Object.fromEntries(colors.map((color) => [color, galleryFor(color)]))
}

function ShortsPage(props: { onBack: () => void; onAddToBag: (item: BagItem) => void }) {
  const [styleId, setStyleId] = useState('8900000000086')
  const [variantId, setVariantId] = useState(
    preferredVariant(shorts.filter((item) => item.styleId === '8900000000086'), 'M').id,
  )
  const variants = shorts.filter((item) => item.styleId === styleId)
  const product = variants.find((item) => item.id === variantId) ?? preferredVariant(variants, 'M')
  const colors = [...new Set(variants.map((item) => item.color))]

  function selectStyle(nextStyleId: string) {
    const nextVariants = shorts.filter((item) => item.styleId === nextStyleId)
    setStyleId(nextStyleId)
    setVariantId(preferredVariant(nextVariants, 'M').id)
  }

  return (
    <ProductDetail
      key={product.styleId}
      product={product}
      variants={variants}
      title={product.styleName}
      crumb="Shorts"
      styleOptions={shortStyles}
      onStyleChange={selectStyle}
      onVariantChange={setVariantId}
      colorHex={colorHex}
      colorGalleries={galleriesFor(colors)}
      copy={[
        'Trail-ready cargo shorts with extra pockets.',
        'Quick-dry ripstop fabric.',
        'Cut for an easy hiking fit.',
      ]}
      extraDetails={[
        [
          'Size & fit',
          'Available sizes: ' +
            sortSizes([...new Set(variants.map((item) => item.size))]).join(', ') +
            '. Regular hits above the knee; Tall adds extra length.',
        ],
        ['Fabric & care', 'Ripstop blend. Machine wash cold, line dry.'],
      ]}
      onBack={props.onBack}
      onAddToBag={props.onAddToBag}
    />
  )
}

export default ShortsPage
