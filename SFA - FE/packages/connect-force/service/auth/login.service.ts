import {
  IChangePassword,
  ILoginCredentials,
} from "@/types/authTypes/auth-types";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const userLogin = async (credentials: ILoginCredentials) => {
  const res = await fetch(`${NEXT_PUBLIC_API_URL}auth/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: { "Content-Type": "application/json" },
  });

  return res;
};

export const userChangePassword = async (credentials: IChangePassword) => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_API_URL}auth/passwordupdate`, {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: { "Content-Type": "application/json" },
    });

    return await res.json();
  } catch (error) {
    throw error;
  }
};

// FORGET PASSWORD
export const userForgotPassword = async (data: any) => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_API_URL}forgetpassword/create`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const userForgotPasswordUpdate = async (data: any) => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_API_URL}forgetpassword/update`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const adminSideResetPasswordForAllUsers = async (data: any) => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_API_URL}forgetpassword/admin/update`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    return await res.json();
  } catch (error) {
    throw error;
  }
};
