type User = {
  email: string;
  password: string;
};
type IUser = {
  id?: string;
  email: string;
  password?: string;
};

export { User, IUser };
