import { customFetch } from "./customFetch";

export const postCompleteClass = async (object) => {
  const pathname = `api/clases-finalizadas`;

  return await customFetch(pathname, "POST", object);
};
