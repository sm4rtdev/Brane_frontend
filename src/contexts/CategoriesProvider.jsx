import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { CategoriesContext } from "./CategoriesContext";
import { getCategories } from "../api/getCategories";
import { UserDataContext } from "./UserDataContext";

const CategoriesProvider = ({ children }) => {
  const { userData } = useContext(UserDataContext);

  const [categories, setCategories] = useState(null);

  useEffect(() => {
    if (userData.jwt) {
      const getData = async () => {
        const { ok, data } = await getCategories();

        if (ok) {
          setCategories(data.data);
        } else {
          toast.error(`${data.error.message}`);
        }
      };

      getData();
    }
  }, [userData]);

  return (
    <CategoriesContext.Provider value={{ categories }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export default CategoriesProvider;
