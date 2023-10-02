import { customFetch } from "./customFetch";

export const getInstitutionUsers = async () => {
  const pathname = `api/users-permissions/users/institutionUsers/`;

  return await customFetch(pathname);
};
