/*
  Warnings:

  - Added the required column `orderSlipIMG` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productPrice` to the `ProductOnOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productTotal` to the `ProductOnOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "orderSlipIMG" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductOnCart" ALTER COLUMN "quantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "ProductOnOrder" ADD COLUMN     "productPrice" INTEGER NOT NULL,
ADD COLUMN     "productTotal" INTEGER NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT;
