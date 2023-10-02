import { customFetch } from "./customFetch";

export const getUserBySlug = async (slug) => {
  const pathname = `api/users/slug/${slug}`;

  return await customFetch(pathname);
};
