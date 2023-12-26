import { customFetch } from "./customFetch";

export const getGoogleLogin = async () => {
  const pathname = `strapi-google-auth/init`;

  return await customFetch(pathname);
};
