export enum PriceBase {
  PER_NIGHT = 'Night',
  PER_WEEK = 'Week',
  PER_MONTH = 'Month',
}

export type imageType = {
  id: number;
  img_url: string;
}
export type StayPlace = {
  id: string;
  images: imageType[];
  title: string;
  description: string;
  location: string;
  price: {
    value: number;
    base: PriceBase;
  };
  amenities?: string[];
  amenitiesExclusions?: string[];
  coords: {
    lat: number;
    lng: number;
  };
  owner: {
    email: string;
  };
};
