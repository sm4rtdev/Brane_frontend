import { customFetch } from "./customFetch";

export const postDeallocateCourse = async (object) => {
  const pathname = `api/company/course/deleteUser`;

  return await customFetch(pathname, "POST", object);
};
