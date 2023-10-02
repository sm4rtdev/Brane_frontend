import { customFetch } from "./customFetch";

export const getCompanyUsers = async (id) => {
  const pathname = `api/users?populate=*&filters[company][id][$eq]=${id}`;

  return await customFetch(pathname);
};
