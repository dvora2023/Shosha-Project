export interface Product {
  _id?: string;
  name: string;
  image?: string;
  status: boolean;
  price: number;
  category: string; // מזהה הקטגוריה (ObjectId)
}