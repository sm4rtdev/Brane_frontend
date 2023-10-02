import { customFetch } from "./customFetch";

export const deleteCoupon = async (id) => {
  const pathname = `api/cupons/${id}`;

  return await customFetch(pathname, "DELETE");
};
