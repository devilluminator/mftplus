export type States = {
  provinceID: number;
  name: string;
  slug: string;
  cities: Cities;
}[];

export type Cities = {
  cityID: number;
  name: string;
  slug: string;
  isCapital: string;
  districts: Array<{
    districtID: number;
    name: string;
    showInListingForm: string;
    showInFilters: string;
  }>;
  allowedToFilterByDistrict: boolean;
  ownCity: {};
  lat: string;
  lon: string;
}[];
