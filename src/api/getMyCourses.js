import { customFetch } from "./customFetch";

export const getMyCourses = async (limit) => {
  const pathname = `api/mis-cursos?populate=deep${
    limit ? "&pagination[limit]=6" : ""
  }`;

  return await customFetch(pathname);
};
