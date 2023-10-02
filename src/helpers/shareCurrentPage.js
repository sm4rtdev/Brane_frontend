import { FRONT } from "../api/settings";
import { toast } from "react-toastify";

export const shareCurrentPage = (location) => {
  const url = `${FRONT}${location.pathname.slice(1)}`;

  navigator.clipboard
    .writeText("assd")
    .then(() => {
      toast.success("El enlace a esta página ha sido copiado al portapapeles.");
    })
    .catch(() => {
      toast.info("No se pudo compartir");
    });

  console.log(url);
};
