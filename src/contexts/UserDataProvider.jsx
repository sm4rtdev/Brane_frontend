import React, { useContext, useEffect, useState } from "react";

import {
  getFromLocal,
  removeFromLocal,
  updateLocal,
} from "../helpers/localStorage";

import { getInstitutionMetadata } from "../api/getInstitutionMetadata";
import { getUserMetadata } from "../api/getUserMetadata";
import { getCompanyMeta } from "../api/getCompanyMeta";
import { UserDataContext } from "./UserDataContext";
import { getUser } from "../api/getUser";
import { CartContext } from "./CartContext";

const UserDataProvider = ({ children }) => {
  const { clearCart } = useContext(CartContext);

  const [userData, setUserData] = useState({
    jwt: getFromLocal("loggedUser") || null,
    info: null,
    meta: null,
    avatar: null,
    instructor: false,
    company: false,
    institution: false,
    mode: getFromLocal("mode") || "student",
  });

  const [refresh, setRefresh] = useState(null);
  const [metadataRefresh, setMetadataRefresh] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);

  const updateUserData = (object) => {
    setUserData((current) => {
      return { ...current, ...object };
    });
  };

  const closeSession = () => {
    removeFromLocal("tempUser");
    removeFromLocal("loggedUser");
    removeFromLocal("mode");
    removeFromLocal("cart");
    window.stop();

    setTimeout(() => {
      clearCart();
      updateUserData({
        jwt: null,
        info: null,
        meta: null,
        avatar: null,
        instructor: false,
        company: false,
        institution: false,
        mode: "student",
      });
    }, 100);
  };

  const updateUserInfo = async () => {
    const { ok, data: info } = await getUser();
    // console.log("Info", info);

    if (ok) {
      if (info.role.id === 4) {
        const { data: meta } = await getCompanyMeta();

        updateUserData({
          info,
          meta: meta.data.attributes,
          avatar: info.avatar ? info.avatar : null,
          company: true,
        });
      } else if (info.role.id === 6) {
        const { data: meta } = await getInstitutionMetadata();

        // console.log(meta);

        updateUserData({
          info,
          meta: meta.data.attributes,
          avatar: info.avatar ? info.avatar : null,
          institution: true,
        });
      } else {
        const { data: meta } = await getUserMetadata();

        updateUserData({
          info,
          meta: meta.data.attributes,
          avatar: info.avatar ? info.avatar : null,
          instructor: info.role.name === "Instructor",
        });
      }
    } else {
      closeSession();
    }
  };

  const updateMetadata = async () => {
    const { data: meta } = await getUserMetadata();

    updateUserData({
      meta: meta.data.attributes,
    });
  };

  const changeMode = (id) => {
    if (userData.instructor) {
      if (id === 1) {
        updateUserData({ mode: "instructor" });
        updateLocal("mode", "instructor");
      } else {
        updateUserData({ mode: "student" });
        updateLocal("mode", "student");
      }
    }
  };

  useEffect(() => {
    if (userData.jwt && !userData.info) {
      updateUserInfo();
      setLoadingInfo(true);
    } else {
      setLoadingInfo(false);
    }
  }, [userData]); //eslint-disable-line

  useEffect(() => {
    if (userData.jwt && refresh !== null) {
      updateUserInfo();
    }
  }, [refresh]); //eslint-disable-line

  useEffect(() => {
    if (userData.jwt && metadataRefresh !== null) {
      updateMetadata();
    }
  }, [metadataRefresh]); //eslint-disable-line

  return (
    <UserDataContext.Provider
      value={{
        userData,
        updateUserData,
        setRefresh,
        closeSession,
        changeMode,
        setMetadataRefresh,
        loadingInfo,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataProvider;
