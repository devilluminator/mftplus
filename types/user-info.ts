export type UserInfo = {
  id: number;
  uuid: string | null;
  full_name: string | null;
  email?: string | null;
  password?: string | null;
  phone_number?: string | null;
  role?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  token?: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  lat: string | null;
  lng: string | null;
};
