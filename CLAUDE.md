# HAVEN shopping cart

What this repo is, how the shop behaves, and what is already stored in PostgreSQL.

The storefront is called HAVEN. It sells pants, shirts, shorts, and socks. The frontend still reads a local catalog. The backend has the database and a health check. The shop does not call the API yet.

## Repository

npm workspaces. Run commands from the repo root.

```
shoppingcart/
  apps/frontend/     React + Vite + TypeScript
  apps/backend/      Express + TypeScript + Prisma 7
  CLAUDE.md
```

Node 22 is required for the frontend. Vite 8 does not start on Node 20.11. This machine has Node 22.23.2 under nvm. PostgreSQL 16 is installed at `/Library/PostgreSQL/16` and accepts connections on the local socket, port 5432. The database name is `shopping-cart`. The connection string lives in `apps/backend/.env` and is not committed.

```bash
npm run dev:frontend    # http://localhost:5173/
npm run dev:backend     # http://localhost:3001/health
npm run db:seed -w backend
```

## Frontend

React state chooses the page. There is no router. Pages are `home`, `t-shirt`, `pants`, `shorts`, `socks`, and `bag`.

The header search filters the home-page result count by style name, brand, and color. Category and size filters do the same. The grid on the home page always shows four category cards (pants, t-shirts, shorts, socks). The result count is the number of matching product rows, not the number of cards.

A category page is one style at a time. The shopper picks a style, then a color and a size. Those choices select a different product row. Fit is Regular or Tall and does not change the barcode or the price. Quantity cannot exceed `availableQuantity`, and it also cannot exceed 8.

The bag is only in React state. Adding an item appends a line. The same variant added twice stays as two lines. The header count is the sum of quantities. Tax is 6 percent of the subtotal. Pay Now clears the bag and shows a thank-you message. Nothing is saved, and there is no customer or payment.

The crossed-out price on a product page is the current price divided by 0.8, labeled as 20 percent off. That list price is display only. It is not stored.

### Mock catalog

`apps/frontend/src/data/clothing.json` holds two lists, `products` and `prices`. `clothing.ts` joins each product to its current price.

A product row in the mock file:

| Field | Meaning |
|---|---|
| `id` | Barcode of one sellable variant |
| `productType` | `Pants`, `Shorts`, `Shirts`, or `Socks` |
| `color` | One color |
| `size` | One size |
| `availableQuantity` | Units on hand for that barcode |
| `brand` | `Nike`, `Adidas`, or `Tommy` |
| `styleName` | Style label, used only by the shop UI |
| `styleId` | Original style id, used to group variants and photos |

A price row:

| Field | Meaning |
|---|---|
| `id` | Price record id |
| `productId` | Barcode it belongs to |
| `pricePerUnit` | Amount |
| `isCurrent` | Whether this amount is the active price |

There are 522 products and 522 prices. Every price is current. Brands were assigned by rotating Nike, Adidas, and Tommy once per style, because the old mock file had no brand. Each variant of a style carries that style's original stock count, because the old file had one count per style rather than one count per barcode.

`styleName` and `styleId` are not database columns. How to store a style is still an open decision.

## Barcode

A barcode identifies one thing a customer can buy on its own. The same brand and style in different sizes or colors are different products and different barcodes. Example: white XL of the crewneck is `8900000000001-White-XL`. White M of that same style is a different id.

The barcode does not contain the price. When the price changes, the barcode stays the same and a new `Prices` row is added. `IsCurrent` marks the active one.

## Database

Prisma 7, PostgreSQL. Schema: `apps/backend/prisma/schema.prisma`. Client output: `apps/backend/src/generated/prisma`. Connection config: `apps/backend/prisma7.config.ts`. The client is created in `apps/backend/src/db.ts`.

Money columns are `decimal(12, 2)`. String ids are supplied by the application. Nothing generates them.

### Products

One row per barcode.

| Column | Notes |
|---|---|
| `Id` | Primary key. The barcode |
| `ProductType` | `Pants`, `Shorts`, `Shirts`, `Socks` |
| `Color` | One color |
| `Size` | One size |
| `AvailableQuantity` | Stock for this barcode only |
| `Brands` | `Nike`, `Adidas`, `Tommy` |

Stock lives only in `AvailableQuantity`. Do not put it on `Prices`, on a style, or in another table.

### Prices

Price history for a product.

| Column | Notes |
|---|---|
| `Id` | Primary key |
| `ProductId` | Foreign key to `Products.Id` |
| `PricePerUnit` | Amount |
| `IsCurrent` | The active price |

A product can have many price rows over time. The seed created one current row per product.

### Customers

| Column | Notes |
|---|---|
| `Id` | Primary key |
| `FirstName`, `LastName`, `Email`, `Phone` | Strings |
| `Birthdate` | Timestamp |

No customers have been seeded.

### Purchases

A purchase is the receipt. `CustomerId` is optional, so a purchase can exist without a customer.

| Column | Notes |
|---|---|
| `Id` | Primary key |
| `Subtotal`, `Tax`, `Total`, `Discount` | Decimals |
| `PurchaseDate` | Timestamp |
| `TransactionNumber` | String |
| `CustomerId` | Optional foreign key to `Customers.Id` |

### PurchaseItems

A line on a receipt. It points at a purchase and at a price row, so the amount charged is the price record, not a number copied onto the line.

| Column | Notes |
|---|---|
| `Id` | Primary key |
| `PurchaseId` | Foreign key to `Purchases.Id` |
| `PriceId` | Foreign key to `Prices.Id` |
| `PurchaseQuantity` | Units on this line |

### Relationships

```
Products 1──* Prices 1──* PurchaseItems *──1 Purchases *──1 Customers
```

`Purchases.CustomerId` may be null.

## Seed

`apps/backend/src/seed.ts` reads the mock catalog and writes `Products` and `Prices` only. It skips `styleName` and `styleId`. It deletes existing products and prices first, then inserts. It refuses to run if any purchase item already points at a price.

```bash
npm run db:seed -w backend
```

The seeded example checked in the database: product `8900000000001-White-XL`, type Shirts, color White, size XL, brand Nike, `AvailableQuantity` 7, current price 23.99.

## Not built yet

- The API route is only `GET /health`. The frontend does not use the database.
- Purchases and customers have tables and no rows.
- Fit exists on the bag in the browser and has no column.
- The 20 percent display discount is not stored.
- Where a style name lives in the database is undecided. The mock file still has `styleName` and `styleId` so the shop can group variants.
