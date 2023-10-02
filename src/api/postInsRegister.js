import { customFetch } from "./customFetch";

export const postInsRegister = async (object) => {
  const pathname = `api/users-permissions/users/institutionRegister/`;

  return await customFetch(pathname, "POST", object);
};
