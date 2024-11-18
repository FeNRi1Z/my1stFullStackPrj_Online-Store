/*
  Warnings:

  - You are about to drop the column `productTotal` on the `ProductOnOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "orderTotal" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductOnOrder" DROP COLUMN "productTotal";
