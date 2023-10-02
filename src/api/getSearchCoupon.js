import { customFetch } from "./customFetch";

export const getSearchCoupon = async (coupon) => {
  const pathname = `api/cupons?filters[slug][$eq]=${coupon}&filters[estado][$eq]=true&populate=cursos`;

  return await customFetch(pathname);
};
