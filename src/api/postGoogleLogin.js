import { customFetch } from "./customFetch";

export const postGoogleLogin = async (object) => {
  const pathname = `strapi-google-auth/user-profile`;

  return await customFetch(pathname, "POST", object);
};
