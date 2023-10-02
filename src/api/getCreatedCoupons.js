import { customFetch } from "./customFetch";

export const getCreatedCoupons = async () => {
  const pathname = `api/cupon/findme`;

  return await customFetch(pathname);
};
