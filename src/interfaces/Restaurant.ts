export interface Location {
  lat: number;
  lng: number;
}

export interface Geometry {
  location: Location;
}

export interface Rating {
  stars: number;
  comment: string;
}

export interface Restaurant {
  business_status: string;
  geometry: Geometry;
  icon: string;
  id: string; // This seems to be a unique identifier for the restaurant
  restaurant_name: string;
  place_id: string;
  price_level?: number; // Optional as it might not be present for all
  average_rating: number;
  ratings: Rating[];
  types: string[];
  user_ratings_total: number;
  vicinity: string;
}
