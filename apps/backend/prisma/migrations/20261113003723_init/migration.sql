-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('Pants', 'Shorts', 'Shirts', 'Socks');

-- CreateEnum
CREATE TYPE "Brand" AS ENUM ('Nike', 'Adidas', 'Tommy');

-- CreateTable
CREATE TABLE "Products" (
    "Id" TEXT NOT NULL,
    "ProductType" "ProductType" NOT NULL,
    "Color" TEXT NOT NULL,
    "Size" TEXT NOT NULL,
    "AvailableQuantity" INTEGER NOT NULL,
    "Brands" "Brand" NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Prices" (
    "Id" TEXT NOT NULL,
    "ProductId" TEXT NOT NULL,
    "PricePerUnit" DECIMAL(12,2) NOT NULL,
    "IsCurrent" BOOLEAN NOT NULL,

    CONSTRAINT "Prices_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Purchases" (
    "Id" TEXT NOT NULL,
    "Subtotal" DECIMAL(12,2) NOT NULL,
    "Tax" DECIMAL(12,2) NOT NULL,
    "Total" DECIMAL(12,2) NOT NULL,
    "Discount" DECIMAL(12,2) NOT NULL,
    "PurchaseDate" TIMESTAMP(3) NOT NULL,
    "TransactionNumber" TEXT NOT NULL,
    "CustomerId" TEXT,

    CONSTRAINT "Purchases_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "PurchaseItems" (
    "Id" TEXT NOT NULL,
    "PurchaseId" TEXT NOT NULL,
    "PriceId" TEXT NOT NULL,
    "PurchaseQuantity" INTEGER NOT NULL,

    CONSTRAINT "PurchaseItems_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Customers" (
    "Id" TEXT NOT NULL,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Phone" TEXT NOT NULL,
    "Birthdate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE INDEX "Prices_ProductId_idx" ON "Prices"("ProductId");

-- CreateIndex
CREATE INDEX "Purchases_CustomerId_idx" ON "Purchases"("CustomerId");

-- CreateIndex
CREATE INDEX "PurchaseItems_PurchaseId_idx" ON "PurchaseItems"("PurchaseId");

-- CreateIndex
CREATE INDEX "PurchaseItems_PriceId_idx" ON "PurchaseItems"("PriceId");

-- AddForeignKey
ALTER TABLE "Prices" ADD CONSTRAINT "Prices_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "Products"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchases" ADD CONSTRAINT "Purchases_CustomerId_fkey" FOREIGN KEY ("CustomerId") REFERENCES "Customers"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseItems" ADD CONSTRAINT "PurchaseItems_PurchaseId_fkey" FOREIGN KEY ("PurchaseId") REFERENCES "Purchases"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseItems" ADD CONSTRAINT "PurchaseItems_PriceId_fkey" FOREIGN KEY ("PriceId") REFERENCES "Prices"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
