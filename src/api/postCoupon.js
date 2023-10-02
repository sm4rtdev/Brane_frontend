import { customFetch } from "./customFetch";

export const postCoupon = async (object) => {
  const pathname = `api/cupons`;

  return await customFetch(pathname, "POST", object);
};
