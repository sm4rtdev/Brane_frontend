import { customFetch } from "./customFetch";

export const postWishlistAddDelete = async (object) => {
  const pathname = `api/wishlist/add-delete/`;

  return await customFetch(pathname, "POST", object);
};
