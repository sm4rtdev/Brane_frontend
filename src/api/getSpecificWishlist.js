import { customFetch } from "./customFetch";

export const getSpecificWishlist = async (id) => {
  const pathname = `api/list-wishlists/${id}`;

  return await customFetch(pathname);
};
