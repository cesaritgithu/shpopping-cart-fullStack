import { useState } from 'react'
import clothing, { preferredVariant, sortSizes, stylesOf } from './data/clothing.ts'
import ProductDetail from './ProductDetail.tsx'
import type { BagItem } from './types.ts'
import pantsIndigo1 from './assets/pants-indigo-1.jpg'
import pantsIndigo2 from './assets/pants-indigo-2.jpg'
import pantsBlackSlim1 from './assets/pants-blackslim-1.jpg'
import pantsBlackSlim2 from './assets/pants-blackslim-2.jpg'
import pantsChino1 from './assets/pants-chino-1.jpg'
import pantsChino2 from './assets/pants-chino-2.jpg'
import cargoPants from './assets/cargo-pants.jpg'
import pantsTrail2 from './assets/pants-trail-2.jpg'
import pantsTan1 from './assets/pants-tan-1.jpg'
import pantsJoggers1 from './assets/pants-joggers-1.jpg'
import pantsJoggers2 from './assets/pants-joggers-2.jpg'
import pantsDress1 from './assets/pants-dress-1.jpg'
import pantsDress2 from './assets/pants-dress-2.jpg'
import pantsSlate1 from './assets/pants-slate-1.jpg'
import pantsSlate2 from './assets/pants-slate-2.jpg'
import pantsLightwash1 from './assets/pants-lightwash-1.jpg'
import pantsLightwash2 from './assets/pants-lightwash-2.jpg'
import pantsCargoJog1 from './assets/pants-cargojog-1.jpg'
import pantsCargoJog2 from './assets/pants-cargojog-2.jpg'
import pantsHike1 from './assets/pants-hike-1.jpg'
import pantsNavyWorn from './assets/pants-navy-worn.jpg'
import pantsBlackJog from './assets/pants-blackjog.jpg'

const pants = clothing.filter((item) => item.productType === 'Pants')
const pantStyles = stylesOf(pants)

const colorHex: Record<string, string> = {
  White: '#f3f1ea',
  Black: '#161616',
  Navy: '#1b2a4a',
  Charcoal: '#4a4a4a',
  Olive: '#6b6a3d',
  Sand: '#cbb79b',
  Ivory: '#f4f0e4',
  Khaki: '#c4b07a',
  'Heather Gray': '#b8b8b8',
  'Washed Black': '#2c2c2c',
  'Coyote Brown': '#8a5a2b',
  'Light Wash': '#9bb4d0',
  'Medium Wash': '#5a7aa8',
  'Dark Wash': '#2a3d5c',
  'Dark Indigo': '#24344f',
  'Steel Blue': '#6d7f8c',
  Slate: '#6a7380',
}

const colorGalleries: Record<string, string[]> = {
  Black: [pantsChino1, pantsChino2],
  'Washed Black': [pantsBlackSlim1, pantsBlackSlim2],
  Charcoal: [pantsDress2, pantsBlackJog],
  Navy: [pantsNavyWorn, pantsDress1],
  Olive: [cargoPants, pantsCargoJog1],
  'Coyote Brown': [pantsTan1, pantsHike1],
  Khaki: [pantsHike1, pantsTrail2],
  Sand: [pantsTan1, pantsHike1],
  'Heather Gray': [pantsJoggers1, pantsJoggers2],
  'Light Wash': [pantsLightwash1, pantsLightwash2],
  'Medium Wash': [pantsIndigo2, pantsIndigo1],
  'Dark Indigo': [pantsIndigo1, pantsNavyWorn],
  'Dark Wash': [pantsIndigo1, pantsDress2],
  'Steel Blue': [pantsSlate1, pantsSlate2],
  Slate: [pantsJoggers1, pantsSlate2],
  White: [pantsLightwash2, pantsLightwash1],
  Ivory: [pantsTan1, pantsLightwash2],
}

const styleGalleries: Record<string, Record<string, string[]>> = {
  '8900000000041': {
    'Light Wash': [pantsLightwash1, pantsLightwash2],
    'Medium Wash': [pantsIndigo2, pantsIndigo1],
    'Dark Indigo': [pantsIndigo1, pantsNavyWorn],
  },
  '8900000000042': {
    'Washed Black': [pantsBlackSlim1, pantsBlackSlim2],
    Black: [pantsChino1, pantsChino2],
    Charcoal: [pantsDress2, pantsBlackJog],
  },
  '8900000000043': {
    Black: [pantsChino1, pantsChino2],
    Navy: [pantsNavyWorn, pantsDress1],
    Olive: [cargoPants, pantsCargoJog1],
  },
  '8900000000044': {
    Olive: [cargoPants, pantsTrail2],
    Black: [pantsChino1, pantsChino2],
    'Coyote Brown': [pantsTan1, pantsHike1],
  },
  '8900000000045': {
    'Heather Gray': [pantsJoggers1, pantsJoggers2],
    Black: [pantsBlackJog, pantsChino1],
    Navy: [pantsNavyWorn, pantsDress1],
  },
  '8900000000046': {
    Navy: [pantsDress1, pantsNavyWorn],
    Black: [pantsChino1, pantsDress2],
    Charcoal: [pantsDress2, pantsBlackJog],
  },
  '8900000000047': {
    'Steel Blue': [pantsSlate1, pantsSlate2],
    Slate: [pantsJoggers1, pantsSlate2],
    Ivory: [pantsTan1, pantsLightwash2],
  },
  '8900000000048': {
    'Light Wash': [pantsLightwash1, pantsLightwash2],
    'Dark Wash': [pantsIndigo1, pantsDress2],
    White: [pantsLightwash2, pantsTan1],
  },
  '8900000000049': {
    Olive: [pantsCargoJog1, pantsCargoJog2],
    Black: [pantsBlackJog, pantsChino1],
    'Heather Gray': [pantsJoggers1, pantsJoggers2],
  },
  '8900000000050': {
    Khaki: [pantsHike1, pantsTrail2],
    Olive: [cargoPants, pantsCargoJog1],
    Sand: [pantsTan1, pantsHike1],
  },
}

const styleCopy: Record<string, string[]> = {
  '8900000000041': [
    'Classic indigo denim in a straight leg.',
    'Five-pocket styling with a mid rise.',
    'Cut to sit clean through the thigh and hem.',
  ],
  '8900000000042': [
    'Washed black slim jeans with a street fit.',
    'Soft stretch denim that holds its shape.',
    'Tapers through the leg to the ankle.',
  ],
  '8900000000043': [
    'Slim chino pants in a matte cotton twill.',
    'Easy enough for everyday, sharp enough for night.',
    'Tapered leg with a clean flat front.',
  ],
  '8900000000044': [
    'Trail-ready pants in a durable olive twill.',
    'Built for movement on long days outside.',
    'Relaxed straight leg with a utility waist.',
  ],
  '8900000000045': [
    'Soft fleece joggers with a tapered cuff.',
    'Drawstring waist and side pockets.',
    'Cut for easy lounge and weekend wear.',
  ],
  '8900000000046': [
    'Wide-leg dress trousers with a tailored drape.',
    'Smooth woven fabric with a clean crease.',
    'High rise that sits at the waist.',
  ],
  '8900000000047': [
    'Straight trousers in a muted steel blue.',
    'Soft woven fabric with a comfortable rise.',
    'Easy enough to wear with a tee or belt.',
  ],
  '8900000000048': [
    'High-rise jeans in a light vintage wash.',
    'Relaxed through the hip with a tapered ankle.',
    'Finished with a rolled hem.',
  ],
  '8900000000049': [
    'Olive cargo joggers with a tapered cuff.',
    'Utility pockets and a drawstring waist.',
    'Street-ready fit with stretch fabric.',
  ],
  '8900000000050': [
    'Khaki hiking pants in a lightweight technical fabric.',
    'Convertible zip at the knee for the trail.',
    'Relaxed fit with room to move.',
  ],
}

function galleriesFor(styleId: string, colors: string[]) {
  const style = styleGalleries[styleId] ?? {}
  return Object.fromEntries(
    colors.map((color) => [
      color,
      style[color] ?? colorGalleries[color] ?? colorGalleries.Black ?? [],
    ]),
  )
}

function PantsPage(props: { onBack: () => void; onAddToBag: (item: BagItem) => void }) {
  const [styleId, setStyleId] = useState('8900000000044')
  const [variantId, setVariantId] = useState(
    preferredVariant(pants.filter((item) => item.styleId === '8900000000044'), '32').id,
  )
  const variants = pants.filter((item) => item.styleId === styleId)
  const product = variants.find((item) => item.id === variantId) ?? preferredVariant(variants, '32')
  const colors = [...new Set(variants.map((item) => item.color))]

  function selectStyle(nextStyleId: string) {
    const nextVariants = pants.filter((item) => item.styleId === nextStyleId)
    setStyleId(nextStyleId)
    setVariantId(preferredVariant(nextVariants, '32').id)
  }

  return (
    <ProductDetail
      key={product.styleId}
      product={product}
      variants={variants}
      title={product.styleName}
      crumb="Pants"
      styleOptions={pantStyles}
      onStyleChange={selectStyle}
      onVariantChange={setVariantId}
      colorHex={colorHex}
      colorGalleries={galleriesFor(product.styleId, colors)}
      copy={styleCopy[product.styleId] || styleCopy['8900000000044']}
      extraDetails={[
        [
          'Size & fit',
          'Available sizes: ' +
            sortSizes([...new Set(variants.map((item) => item.size))]).join(', ') +
            '. Regular sits at the ankle; Tall adds extra inseam.',
        ],
        ['Fabric & care', 'Machine wash cold, tumble dry low.'],
      ]}
      onBack={props.onBack}
      onAddToBag={props.onAddToBag}
    />
  )
}

export default PantsPage
