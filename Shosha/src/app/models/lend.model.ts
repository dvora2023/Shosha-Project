export interface Lend {
  _id?: string;
  lendingDate: Date;
  returnDate: Date;
  user: string;    // מזהה המשתמש (ObjectId)
  product: string; // מזהה המוצר (ObjectId)
}