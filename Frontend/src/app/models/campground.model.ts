import { Review } from "./review.model";

export interface Campground {
  longitude: any;
  latitude: any;
  name: any;
  campgroundId: number;
  title: string;
  description: string;
  location: string;
  images: { url: string, filename: string }[];
  price: number;
  author: {
  userId: number; 
    username: string;
  };
  reviews?: Review[];
  geometry: {
    coordinates: number[];
  };
}
