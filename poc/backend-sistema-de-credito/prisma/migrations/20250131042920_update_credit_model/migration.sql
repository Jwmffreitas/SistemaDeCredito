/*
  Warnings:

  - You are about to drop the `CreditRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "CreditRequest";

-- CreateTable
CREATE TABLE "Credit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Credit_pkey" PRIMARY KEY ("id")
);
