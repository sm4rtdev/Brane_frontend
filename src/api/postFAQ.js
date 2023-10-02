import { customFetch } from "./customFetch";

export const postFAQ = async (object) => {
  const pathname = `api/fa-qs`;

  return await customFetch(pathname, "POST", object);
};
