export interface User {
  _id?: string;
  userName: string;
  password?: string;
  tz?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  mail: string;
  status: boolean;
  category?: string;
  profilePhoto?: string;  // ← הוסיפי את זה
  createdAt?: Date;       // ← אופציונלי אבל כדאי
}