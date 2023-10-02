import { customFetch } from "./customFetch";

export const postReview = async (object) => {
  const pathname = `api/valoracion-cursos`;

  return await customFetch(pathname, "POST", object);
};
