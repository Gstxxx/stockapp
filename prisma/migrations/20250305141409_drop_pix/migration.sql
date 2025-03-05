/*
  Warnings:

  - You are about to drop the column `isCard` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `isPixOrCash` on the `Product` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "priceCard" INTEGER,
    "stockQuantity" INTEGER NOT NULL,
    "saleQuantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("createdAt", "id", "name", "price", "priceCard", "saleQuantity", "stockQuantity", "updatedAt") SELECT "createdAt", "id", "name", "price", "priceCard", "saleQuantity", "stockQuantity", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
