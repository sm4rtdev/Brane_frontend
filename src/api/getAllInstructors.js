import { customFetch } from "./customFetch";

export const getAllInstructors = async () => {
  const pathname = `api/users?populate=*&filters[role][id][$eq]=3`;

  return await customFetch(pathname);
};
