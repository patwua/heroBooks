-- CreateTable
CREATE TABLE "CheckoutIntent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GYD',
    "amount" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "promoCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'created',
    "paymentMethod" TEXT,
    "externalRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CheckoutIntent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CheckoutIntent" ADD CONSTRAINT "CheckoutIntent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
