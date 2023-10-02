import { customFetch } from "./customFetch";

export const getCategories = async () => {
  const pathname = `api/categorias?populate=*`;

  return await customFetch(pathname);
};
