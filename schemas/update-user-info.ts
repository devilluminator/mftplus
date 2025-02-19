import { string, object } from "yup";

export const updateUserInfoSchema = object({
  full_name: string().required("نام به صورت کامل وارد نشده است"),
  email: string().required("ایمیل خود را وارد کنید"),
  address: string().required("آدرس محل سکونت وارد نشده است"),
  city: string().required("نام شهر"),
  state: string().required("نام استان"),
  lat: string(),
  lng: string(),
});
