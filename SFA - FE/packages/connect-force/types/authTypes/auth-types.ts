export interface ILoginCredentials {
  userName: string;
  password: string;
}

export interface IChangePassword {
  userName: string;
  oldPassword: string;
  newPassword: string;
}
