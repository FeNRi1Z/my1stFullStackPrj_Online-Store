/*
  Warnings:

  - You are about to drop the column `orderSlipIMG` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderSlipIMG",
ADD COLUMN     "paymentDate" TIMESTAMP(3),
ADD COLUMN     "paymentSlipIMG" TEXT;
