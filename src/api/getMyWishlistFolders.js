import { customFetch } from "./customFetch";

export const getMyWishlistFolders = async () => {
  const pathname = `api/list-wishlist/me/`;

  return await customFetch(pathname);
};
