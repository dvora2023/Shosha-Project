export interface Comment {
  _id?: string;
  date?: Date;
  userId: string;    // מזהה המשתמש
  productId: string; // מזהה המוצר
}