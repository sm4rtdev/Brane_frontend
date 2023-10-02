import { customFetch } from "./customFetch";

export const postUserMetadata = async (object) => {
  const pathname = `api/meta-usuario/me`;

  return await customFetch(pathname, "POST", object, true);
};
