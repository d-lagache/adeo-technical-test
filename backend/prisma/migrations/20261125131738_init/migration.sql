-- CreateEnum
CREATE TYPE "author_type" AS ENUM ('amateur', 'professional');

-- CreateTable
CREATE TABLE "products" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY,
    "reference" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'EUR',
    "stock" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authors" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "type" "author_type" NOT NULL,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY,
    "product_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,
    "notation" SMALLINT NOT NULL,
    "comment" TEXT NOT NULL,
    "reviewed_at" TIMESTAMP NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_reference_key" ON "products"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "authors_identity_key" ON "authors"("first_name", "last_name", "type");

-- CreateIndex
CREATE INDEX "reviews_product_id_notation_idx" ON "reviews"("product_id", "notation");

-- CreateIndex
CREATE INDEX "reviews_author_id_idx" ON "reviews"("author_id");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddCheckConstraint (ajout manuel : Prisma ne sait pas déclarer les CHECK)
ALTER TABLE "products" ADD CONSTRAINT "products_price_check" CHECK ("price" >= 0);
ALTER TABLE "products" ADD CONSTRAINT "products_stock_check" CHECK ("stock" >= 0);
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_notation_check" CHECK ("notation" BETWEEN 1 AND 5);
