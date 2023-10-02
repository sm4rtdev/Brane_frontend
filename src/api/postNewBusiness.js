import { customFetch } from "./customFetch";

export const postNewBusiness = async (object) => {
  const pathname = `api/users-permissions/users/companyRegister/`;

  return await customFetch(pathname, "POST", object);
};
