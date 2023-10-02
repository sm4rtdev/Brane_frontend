import { ORIGIN } from "./settings";
import { getFromLocal } from "../helpers/localStorage";

export const customFetch = async (pathname, method, object, temp) => {
  const USER_JWT = !temp
    ? getFromLocal("loggedUser") || null
    : getFromLocal("tempUser");

  const url = `${ORIGIN}${pathname}`;

  try {
    // GET
    if (!method || method === "GET") {
      const headers = {
        headers: { Authorization: `Bearer ${USER_JWT}` },
      };

      const response = await fetch(url, USER_JWT ? headers : null);
      const data = await response.json();

      return {
        ok: response.ok,
        data,
      };
    } else if (method === "DELETE") {
      let headers = {};

      if (USER_JWT) {
        headers.Authorization = `Bearer ${USER_JWT}`;
      }

      const response = await fetch(url, {
        headers,
        method,
      });
      const data = await response.json();

      return {
        ok: response.ok,
        data,
      };
    }
    // POST or PUT
    else {
      let headers = {
        "Content-Type": "application/json",
      };

      if (USER_JWT) {
        headers.Authorization = `Bearer ${USER_JWT}`;
      }

      const response = await fetch(url, {
        headers,
        method,
        body: JSON.stringify(object),
      });
      const data = await response.json();

      return {
        ok: response.ok,
        data,
      };
    }
  } catch (error) {
    console.log(error);

    return {
      ok: false,
      data: error || "An error has occurred",
    };
  }
};
