import { customFetch } from "./customFetch";

export const putInstitutionMetadata = async (object) => {
  const pathname = `api/meta-institution/me`;

  return await customFetch(pathname, "PUT", object);
};
