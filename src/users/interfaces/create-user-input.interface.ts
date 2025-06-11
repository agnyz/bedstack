export type CreateUserInput = {
  email: string;
  username: string;
  password: string;
  bio?: string | null;
  image?: string | null;
};
