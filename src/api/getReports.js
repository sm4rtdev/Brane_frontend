import { customFetch } from "./customFetch";

export const getReports = async () => {
  const pathname = `api/users-permissions/users/companyUsers/`;

  return await customFetch(pathname);
};
