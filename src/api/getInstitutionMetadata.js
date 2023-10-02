import { customFetch } from "./customFetch";

export const getInstitutionMetadata = async (temp) => {
  const pathname = `api/meta-institution/me`;

  return await customFetch(pathname, "GET", null, temp);
};
