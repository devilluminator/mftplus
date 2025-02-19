"use server";
import { UTApi } from "uploadthing/server";

export const utapi = async (file: string) => {
  const new_utapi = new UTApi();
  await new_utapi
    .deleteFiles(file)
    .then((res) => console.log(res))
    .catch((error) => console.log(error));
};
// eg. => await utapi.deleteFiles("2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg");
