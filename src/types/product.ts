export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  rating: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Doctor_ {
  id: number;
  profile_image: string;
  full_name: string;
  profession_name: string;
  profession_id: number;
  city_name: string;
  city_id: number;
  province_name: string;
  province_id: number;
  comments_count: number;
  average_rating: number;
  medical_system_code: string;
  phone: string;
  bio: string | null;
  address: string;
  gender: "male" | "female";
  withdraw_count: number;
  experience_years: number;
  partnership_months: number;
  transaction_count: number;
}

export interface DoctorsMeta_ {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface DoctorsResponse_ {
  data: {
    items: Doctor[];
    meta: DoctorsMeta;
  };
  status: number;
}

// src/types/doctor.ts
export interface Doctor {
  id: number;
  profile_image: string;
  full_name: string;
  profession_name: string;
  profession_id: number;
  city_name: string;
  city_id: number;
  province_name: string;
  province_id: number;
  comments_count: number;
  average_rating: number;
  medical_system_code: string;
  phone: string;
  bio: string | null;
  address: string;
  gender: "male" | "female";
  withdraw_count: number;
  experience_years: number;
  partnership_months: number;
  transaction_count: number;
}

export interface DoctorsMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface DoctorsResponse {
  items: Doctor[];
  meta: DoctorsMeta;
}
