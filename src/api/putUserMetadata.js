import { customFetch } from "./customFetch";

export const putUserMetadata = async (object) => {
  const pathname = `api/meta-usuario/me`;

  return await customFetch(pathname, "PUT", object);
};
