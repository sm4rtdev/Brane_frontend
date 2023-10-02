import { customFetch } from "./customFetch";

export const getCouponBySlug = async (coupon) => {
  const pathname = `api/cupons?populate=*&filters[slug][$eq]=${coupon}&filters[estado][$eq]=true`;

  return await customFetch(pathname);
};
