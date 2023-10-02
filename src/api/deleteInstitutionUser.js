import { customFetch } from "./customFetch";

export const deleteInstitutionUser = async (id) => {
  const pathname = `api/users/institutionDeleteUser/${id}`;

  return await customFetch(pathname, "DELETE");
};
