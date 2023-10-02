import { customFetch } from "./customFetch";

export const getNotifications = async () => {
  const pathname = `api/notificacions`;

  return await customFetch(pathname);
};
