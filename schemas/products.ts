import { object, number, string } from "yup";
const productSchema = object({
  id: number().optional(),
  name: string().required("فیلد نام خالی است"),
  description: string().required("فیلد توضیحات خالی است"),
  price: string().required("فیلد قیمت خالی است"),
  code: string().required("فیلد کد خالی است"),
  off: string().required("اگر تخفیف ندارد مقدار برابر 0 باشد"),
  special_off: number().required("فیلد تخفیف ویژه خالی است"),
  og_image: string().required("تصویر بارگذاری نشده است"),
  category: string().required("دسته بندی انتخاب نشده است"),
  colors: string().required("رنگ بندی انتخاب نشده است"),
  brand: string().required("نام برند را وارد کنید"),
  gender: string().optional(),
  size: string().optional(),
  material: string().optional(),
  created_at: string().required(),
  updated_at: string().optional(),
});

export { productSchema };
