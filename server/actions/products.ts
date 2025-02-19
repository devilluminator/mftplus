"use server";
import { db } from "@/server/db";
import { actionClient } from "@/lib/safe-action";
import { eq, desc } from "drizzle-orm";
import { productSchema } from "@/schemas/products";
import { products as productsTable } from "@/server/db/schema";
import { object, string } from "yup";

// ✅ Get all products => DESC This sorts data in the reverse order of ascending
export const getProducts = actionClient.action(async () => {
  const products = await db.query.products.findMany({
    orderBy: [desc(productsTable.id)],
  });
  return { products };
});

// ✅ Add new product
export const addProduct = actionClient
  .schema(productSchema)
  .action(async ({ parsedInput: product }) => {
    return await db
      .insert(productsTable)
      .values(product)
      .then(() => {
        return { success: true, message: "محصول با موفقیت اضافه شد" };
      })
      .catch((error) => {
        console.log(error);
        return { success: false, message: "خطا در اضافه کردن محصول" };
      });
  });
// ✅ Get product info by category again in DESC
export const getProductByCategory = actionClient
  .schema(
    object({
      category: string().required(),
    }),
  )
  .action(async ({ parsedInput: { category } }) => {
    const products = await db.query.products.findMany({
      orderBy: [desc(productsTable.id)],
      where: (products, { eq }) => eq(products.category, category),
    });
    return { products };
  });
// ✅ Edit product by id
export const editProduct = actionClient
  .schema(productSchema)
  .action(async ({ parsedInput: product }) => {
    return await db
      .update(productsTable)
      .set(product)
      .where(eq(productsTable.id, product.id!))
      .then(() => {
        return { success: true, message: "محصول با موفقیت ویرایش شد" };
      })
      .catch((error) => {
        console.log(error);
        return { success: false, message: "خطا در ویرایش محصول" };
      });
  });
// ✅ Delete product by id
export const deleteProduct = async ({ id }: { id: number }) => {
  return await db
    .delete(productsTable)
    .where(eq(productsTable.id, id))
    .then(() => {
      return { success: true, message: "محصول با موفقیت حذف شد" };
    })
    .catch((error) => {
      console.log(error);
      return { success: false, message: "خطا در حذف محصول" };
    });
};
