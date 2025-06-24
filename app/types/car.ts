export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  horsepower?: number;
  location: string;
  images: string[];
  description?: string;
  features?: string[];
  condition: 'new' | 'used' | 'certified';
  bodyType: string;
  drivetrain?: string;
  exteriorColor: string;
  interiorColor?: string;
  vin?: string;
  stockNumber?: string;
}
