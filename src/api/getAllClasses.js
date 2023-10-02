import { customFetch } from "./customFetch";

export const getAllClasses = async (slug) => {
  const pathname = `api/clases?populate=*&filters[curso][slug][$eq]=${slug}`;

  return await customFetch(pathname);
};
