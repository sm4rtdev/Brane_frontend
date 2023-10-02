import { customFetch } from "./customFetch";

export const postCreateWishlist = async (object) => {
  const pathname = `api/list-wishlists`;

  return await customFetch(pathname, "POST", object);
};
