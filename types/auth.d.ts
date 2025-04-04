export type LoginResponse = {
  token: string;
  user: {
    id: string;
    display_name: string;
    email: string;
  };
  message?: string;
};
