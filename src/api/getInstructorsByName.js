import { customFetch } from "./customFetch";

export const getInstructorsByName = async (query) => {
  const pathname = `api/users?populate=*&filters[$or][0][nombre][$contains]=${query}&filters[$or][1][apellidos][$contains]=${query}&filters[role][id][$eq]=3`;

  return await customFetch(pathname);
};
