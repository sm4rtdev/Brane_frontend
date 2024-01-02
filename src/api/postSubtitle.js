import { getFromLocal } from "../helpers/localStorage";
import { ORIGIN } from "./settings";

export const postSubtitle = async (formData) => {
  const pathname = `api/clases/sub-title`;

  const USER_JWT = getFromLocal("loggedUser");

  const url = `${ORIGIN}${pathname}`;

  try {
    // POST
    let headers = {
      Authorization: `Bearer ${USER_JWT}`,
    };

    const response = await fetch(url, {
      headers,
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    return {
      ok: response.ok,
      data,
    };
  } catch (error) {
    console.log(error);

    return {
      ok: false,
      data: error || "An error has occurred",
    };
  }
};
