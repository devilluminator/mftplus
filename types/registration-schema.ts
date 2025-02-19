import { object, string } from "yup";

export const registerValidation = object().shape({
  phone_number: string().min(11, "").required("Phone number is required"),
  pin: string().length(6).nullable(),
});
