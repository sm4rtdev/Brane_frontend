import { customFetch } from "./customFetch";

export const getSpecificReview = async (courseID, userID) => {
  const pathname = `api/valoracion-cursos?populate=*&filters[curso][id][$eq]=${courseID}&filters[usuario][id][$eq]=${userID}`;

  return await customFetch(pathname);
};
