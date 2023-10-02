import { customFetch } from "./customFetch";

export const postCompanyUser = async (object) => {
  const pathname = `api/users/companyCreateUser/`;

  return await customFetch(pathname, "POST", object);
};
