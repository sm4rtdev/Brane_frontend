import { customFetch } from "./customFetch";

export const postCommentInLesson = async (object) => {
  const pathname = `api/comentarios`;

  return await customFetch(pathname, "POST", object);
};
