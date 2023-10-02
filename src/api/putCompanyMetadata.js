import { customFetch } from "./customFetch";

export const putCompanyMetadata = async (object) => {
  const pathname = `api/meta-company/me`;

  return await customFetch(pathname, "PUT", object);
};
