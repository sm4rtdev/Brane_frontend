import { customFetch } from "./customFetch";

export const getCertificate = async (course) => {
  const pathname = `api/estudiante/certificado/${course}`;

  return await customFetch(pathname, "GET");
};
