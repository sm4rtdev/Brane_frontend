import { customFetch } from "./customFetch";

export const getCompanyMeta = async (temp) => {
  const pathname = `api/meta-company/me`;

  return await customFetch(pathname, "GET", null, temp);
};
