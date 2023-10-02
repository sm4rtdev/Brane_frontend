import { ORIGIN } from "../api/settings";

export const getImageLinkFrom = (url) => {
  return `${ORIGIN.slice(0, -1)}${url}`;
};
