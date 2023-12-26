import { customFetch } from "./customFetch";

export const postLessonReport = async (object) => {
  const pathname = `api/supports`;

  return await customFetch(pathname, "POST", object);
};
