import { customFetch } from "./customFetch";

export const getCourseAssignmentStatus = async (id) => {
  const pathname = `api/company/course/findUser/${id}`;

  return await customFetch(pathname);
};
