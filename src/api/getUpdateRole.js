import { customFetch } from "./customFetch";

export const getUpdateRole = async () => {
  const pathname = `api/users-permissions/users/roleInstructor/`;

  return await customFetch(pathname, "GET");
};
