import { customFetch } from "./customFetch";

export const postSubtitle = async (object) => {
  const pathname = `api/clases/sub-title`;

  return await customFetch(pathname, "POST", object);
};
