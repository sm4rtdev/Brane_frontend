import { customFetch } from "./customFetch";

export const postMetaBusiness = async (object) => {
  const pathname = `api/meta-company/me`;

  return await customFetch(pathname, "POST", object, true);
};
