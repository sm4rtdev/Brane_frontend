import { customFetch } from "./customFetch";

export const putReview = async (reviewID, object) => {
  const pathname = `api/valoracion-cursos/${reviewID}`;

  return await customFetch(pathname, "PUT", object);
};
