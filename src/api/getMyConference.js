import { customFetch } from "./customFetch";

export const getMyConference = async (id) => {
  const pathname = `api/mis-cursos?populate=deep&filters[curso][id][$eq]=${id}`;

  return await customFetch(pathname);
};
