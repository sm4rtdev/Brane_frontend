import { customFetch } from "./customFetch";

export const postBuyCourse = async (object) => {
  const pathname = `api/mis-cursos`;

  return await customFetch(pathname, "POST", object);
};
