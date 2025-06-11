export type IUser = {
  id: number;
  email: string;
  username: string;
  bio: string | null;
  image: string | null;
  token: string;
  createdAt: Date;
  updatedAt: Date;
};
