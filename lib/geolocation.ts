"use server";

export default async function addressAsLatLng(address: string) {
  const NEXT_MAP_ADDRESS_API_KEY = process.env.NEXT_MAP_ADDRESS_API_KEY!;
  const response = await fetch(
    `https://api.neshan.org/v6/geocoding?address=${address}`,
    {
      headers: {
        "Api-Key": NEXT_MAP_ADDRESS_API_KEY,
      },
    },
  );
  const response_json = await response.json();
  return response_json;
}
