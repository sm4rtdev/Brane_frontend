import { customFetch } from "./customFetch";

export const deleteCompanyUser = async (id) => {
  const pathname = `api/users/companyDeleteUser/${id}`;

  return await customFetch(pathname, "DELETE");
};
