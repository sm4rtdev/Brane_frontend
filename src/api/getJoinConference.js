import { customFetch } from "./customFetch";

export const getJoinConference = async (id) => {
  const pathname = `api/conferencia/ingresar/${id}`;

  return await customFetch(pathname);
};
