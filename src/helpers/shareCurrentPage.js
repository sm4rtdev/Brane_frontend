import { toast } from "react-toastify";

import { FRONT } from "../api/settings";

export const shareCurrentPage = (location) => {
  const url = `${FRONT}${location.pathname.slice(1)}`;

  navigator.clipboard
    .writeText(url)
    .then(() => {
      toast.success("📋 ✔️");
    })
    .catch(() => {
      toast.info("Error");
    });

  console.log(url);
};
