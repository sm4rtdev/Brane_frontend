import { customFetch } from "./customFetch";

export const postAssignCourse = async (object) => {
  const pathname = `api/company/course/addUser`;

  return await customFetch(pathname, "POST", object);
};
