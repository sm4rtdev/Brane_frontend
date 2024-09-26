import React, { useContext, useEffect, useState } from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import { toast } from "react-toastify";

import "./AddUsers.scss";

import { TrashOutline } from "../../../../assets/icons";

import PageTransition from "../../../../components/PageTransition/PageTransition";
import BusinessHeader from "../../../../components/CustomHeaders/BusinessHeader";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import Footer from "../../../../components/Footer/Footer";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";
import { UserDataContext } from "../../../../contexts/UserDataContext";
import { deleteCompanyUser } from "../../../../api/deleteCompanyUser";
import { getCompanyUsers } from "../../../../api/getCompanyUsers";
import { postCompanyUser } from "../../../../api/postCompanyUser";

const AddUsers = () => {
  const { dictionary, language } = useContext(DictionaryContext);

  const { userData } = useContext(UserDataContext);
  const [users, setUsers] = useState(null);

  const [inputs, setInputs] = useState({ email: "", password: "", role: 1 });
  const [isLoading, setIsLoading] = useState(false);

  const getUsers = async () => {
    const { ok, data } = await getCompanyUsers(userData.info.id);

    if (ok) {
      setUsers(data);
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  useEffect(() => {
    getUsers();
  }, [userData]); //eslint-disable-line

  const addUser = async () => {
    setIsLoading(true);

    const obj = {
      data: {
        email: inputs.email,
        password: inputs.password,
        role: 1,
      },
    };

    const { ok, data } = await postCompanyUser(obj);

    if (ok) {
      toast.success(dictionary.privateBusiness.addUsers[0][language]);
      getUsers();
      setInputs({ email: "", password: "" });
    } else {
      toast.error(`${data.error.message}`);
    }

    setIsLoading(false);
  };

  const deleteUser = async (id) => {
    const { ok, data } = await deleteCompanyUser(id);

    if (ok) {
      toast.success(dictionary.privateBusiness.addUsers[1][language]);
      getUsers();
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  return (
    <div id="add-users" className="page">
      <PageTransition>
        <BusinessHeader />
        <div className="main">
          <h1>{dictionary.privateBusiness.addUsers[2][language]}</h1>

          <h2>{dictionary.privateBusiness.addUsers[3][language]}</h2>

          {users ? (
            users.length > 0 ? (
              <div className="users">
                {users.map((user) => {
                  return (
                    <div key={user.id} className={"user-card"}>
                      <div className="data">
                        <p>
                          <span>ID:</span> <strong>{user.id}</strong>
                        </p>
                        <p>
                          <span>{dictionary.privateBusiness.addUser[9][language]}:</span> <strong>{user.email}</strong>
                        </p>
                        {!user.name && !user.apellidos ? (
                          <p>{dictionary.privateBusiness.addUsers[4][language]}</p>
                        ) : (
                          <p>{`${user.nombre ? user.nombre : ""} ${user.apellidos ? user.apellidos : ""}`}</p>
                        )}
                      </div>
                      <div className="action">
                        <button
                          className="small-button"
                          onClick={() => {
                            deleteUser(user.id);
                          }}
                        >
                          <TrashOutline />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="no-data">{dictionary.privateBusiness.addUsers[5][language]}</p>
            )
          ) : (
            <SpinnerOfDoom standalone center />
          )}

          <h2>{dictionary.privateBusiness.addUsers[6][language]}</h2>

          <div className="add-section">
            <DynamicInput id={"email"} state={[inputs, setInputs]} type="email" />
            <DynamicInput id={"password"} state={[inputs, setInputs]} type="password" />
            <FormControl fullWidth id="role-simple-select">
              <Select
                labelId="role-simple-select-label"
                value={inputs.role}
                style={{
                  borderRadius: "50px",
                  fontFamily: "Inter",
                  fontSize: "0.875rem",
                  height: "2.5rem",
                }}
                onChange={(e) => {
                  setInputs((c) => {
                    return { ...c, role: e.target.value };
                  });
                }}
                elevation={0}
                inputProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        boxShadow: "0 0 8px #0f0e0e20",
                        borderRadius: "1rem",
                      },
                    },
                  },
                }}
              >
                <MenuItem value={1}>{dictionary.privateBusiness.addUsers[7][language]}</MenuItem>
                <MenuItem value={3}>Instructor</MenuItem>
              </Select>
            </FormControl>

            <button
              className="action-button"
              onClick={addUser}
              disabled={isLoading || !inputs.email || !inputs.password}
            >
              {isLoading ? (
                <>
                  <SpinnerOfDoom />
                  {dictionary.spinnerOfDoom[language]}
                </>
              ) : (
                dictionary.privateBusiness.addUsers[8][language]
              )}
            </button>
          </div>
        </div>
        <Footer unique company />
      </PageTransition>
    </div>
  );
};

export default AddUsers;
