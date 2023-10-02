import { customFetch } from "./customFetch";

export const getUserMetadata = async (temp) => {
  const pathname = `api/meta-usuario/me`;

  return await customFetch(pathname, "GET", null, temp);
};
