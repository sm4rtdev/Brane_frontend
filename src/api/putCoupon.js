import { customFetch } from "./customFetch";

export const putCoupon = async (id, object) => {
  const pathname = `api/cupons/${id}`;

  return await customFetch(pathname, "PUT", object);
};
