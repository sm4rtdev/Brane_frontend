import { customFetch } from "./customFetch";

export const postCreateInstitutionUser = async (object) => {
  const pathname = `api/users/institutionCreateUser/`;

  return await customFetch(pathname, "POST", object);
};
