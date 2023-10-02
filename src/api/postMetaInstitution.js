import { customFetch } from "./customFetch";

export const postMetaInstitution = async (object) => {
  const pathname = `api/meta-institution/me`;

  return await customFetch(pathname, "POST", object, true);
};
