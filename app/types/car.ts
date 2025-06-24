export interface Car {
  _id: string;
  productId: string;
  brand: string;
  carModel: string;
  year: number;
  price: number;
  status: string;
  odo: number;
  name: string;
  image: string;
  vin: string;
  registrationNumber: string;
  fuelType: string;
  cc: string;
  cylinders: string;
  transmissionType: string;
  maxSpeed: string;
  bodyType: string;
  trimType: string;
  createdAt: string; // or `Date` if you convert it
  updatedAt: string; // or `Date` if you convert it
  exteriorColor: string;
  stockNumber: string;
  hp: number;
  __v: number;
}

export interface CarDetails {
  product_id: string;
  body_type_id: string;
  status_id: string;
  product_stage_id: string | null;
  vam: boolean;
  payment_order_type_status: string | null;
  description_data: Record<string, string | number | null>;
  description_data_ar: Record<string, string | number | null>;
  location: string;
  vehicle_images: {
    vehicle_id: string;
    parts_images: {
      part_id: string;
      part_name: string;
      image: string;
    }[];
  };
  options: {
    vehicle_id: string;
    options: Option[];
  };
  type: string;
  product_status_id: string | null;
  active: boolean;
  invoice_expiry: string; // ISO string
  contract_number: string;
  paid_status: boolean;
  buyer_id: string;
  disable_status: boolean;
  imageUrl: string[];
  buy_status: string;
}

export interface Option {
  key: string;
  title: string;
  arabic_title: string;
  data: {
    data: string;
    key: string;
    title: string;
    arabic_title: string;
  }[];
}
