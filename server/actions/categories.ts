"use server";
import { db } from "@/server/db";
import { actionClient } from "@/lib/safe-action";
import { categories as categorySchema, products } from "@/server/db/schema";
import { object, string, number } from "yup";
import { eq } from "drizzle-orm";

const schema = object({
  id: number(),
  name: string().required(),
  current_link: string(),
  link: string().required(),
});
//✅ Select All Categories
export const getCategories = actionClient.action(async () => {
  const categories = await db.query.categories.findMany({
    orderBy: [categorySchema.id],
  });
  return { categories };
});
// ✅ Inserting new category
export const addCategory = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { name, link } }) => {
    return await db
      .insert(categorySchema)
      .values({
        name,
        link: link.toLowerCase(),
      })
      .then(() => {
        return { success: true, message: "دسته بندی جدید اضافه شد" };
      })
      .catch((error) => {
        console.log(error);
        return { success: false, message: "خطا در اضافه کردن دسته بندی" };
      });
  });
// ✅ Getting product info
export const getCategory = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { link } }) => {
    const category = await db.query.categories.findFirst({
      where: (categories, { eq }) => eq(categories.link, link),
    });
    console.log("Category =>", category);

    if (!category) return { success: false, category: null };
    return { success: true, category };
  });
// ✅ Update/edit product
export const editCategory = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { name, current_link, link, id } }) => {
    // ✅ Replace all current_link categories with new link (if exist)
    const current_product_category = await db.query.products.findMany({
      where: (products, { eq }) => eq(products.category, current_link!),
    });
    if (current_product_category.length > 0) {
      current_product_category.forEach(async (product) => {
        await db
          .update(products)
          .set({
            category: link.toLowerCase(),
          })
          .where(eq(products.id, product.id))
          .then(() => {
            console.log(
              "\x1b[32m%s\x1b[0m",
              "Product category updated ID => ",
              product.id,
            );
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }

    return await db
      .update(categorySchema)
      .set({
        name,
        link,
      })
      .where(eq(categorySchema.id, id!))
      .then(() => {
        return { success: true, message: "دسته بندی با موفقیت ویرایش شد" };
      })
      .catch((error) => {
        console.log(error);
        return { success: false, message: "خطا در ویرایش دسته بندی" };
      });
  });
// ✅ Delete category by id
export const deleteCategory = async ({ id }: { id: number }) => {
  return await db
    .delete(categorySchema)
    .where(eq(categorySchema.id, id))
    .then(() => {
      return { success: true, message: "دسته بندی با موفقیت حذف شد" };
    })
    .catch((error) => {
      console.log(error);
      return { success: false, message: "خطا در حذف دسته بندی" };
    });
};
