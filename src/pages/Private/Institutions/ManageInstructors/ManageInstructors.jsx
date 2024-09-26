import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import "./ManageInstructors.scss";

import { TrashOutline } from "../../../../assets/icons";

import InstitutionHeader from "../../../../components/CustomHeaders/InstitutionHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import Footer from "../../../../components/Footer/Footer";
import { postCreateInstitutionUser } from "../../../../api/postCreateInstitutionUser";
import { deleteInstitutionUser } from "../../../../api/deleteInstitutionUser";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";
import { getInstitutionUsers } from "../../../../api/getInstitutionUsers";
import { UserDataContext } from "../../../../contexts/UserDataContext";

const initialInputs = { email: "", password: "", role: 3 };

const ManageInstructors = () => {
  const { dictionary, language } = useContext(DictionaryContext);
  const { userData } = useContext(UserDataContext);

  const [inputs, setInputs] = useState(initialInputs);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState(null);

  const getUsers = async () => {
    const { ok, data } = await getInstitutionUsers(userData.info.id);

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
        role: inputs.role,
      },
    };

    const { ok, data } = await postCreateInstitutionUser(obj);

    if (ok) {
      toast.success(dictionary.privateIntitutionsManage[0][language]);
      getUsers();
      setInputs(initialInputs);
    } else {
      toast.error(`${data.error.message}`);
    }

    setIsLoading(false);
  };

  const deleteUser = async (id) => {
    const { ok, data } = await deleteInstitutionUser(id);

    if (ok) {
      toast.success(dictionary.privateIntitutionsManage[1][language]);
      getUsers();
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  return (
    <div id="add-users" className="page">
      <PageTransition margin>
        <InstitutionHeader />
        <div className="main">
          <h1>{dictionary.privateIntitutionsManage[2][language]}</h1>

          <h2>{dictionary.privateIntitutionsManage[3][language]}</h2>

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
                          <span>{dictionary.privateIntitutionsManage[16][language]}:</span> <strong>{user.email}</strong>
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

          <h2>{dictionary.privateIntitutionsManage[4][language]}</h2>

          <div className="add-section">
            <DynamicInput id={"email"} state={[inputs, setInputs]} type="email" />
            <DynamicInput id={"password"} state={[inputs, setInputs]} type="password" />

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
        <Footer unique />
      </PageTransition>
    </div>
  );
};

export default ManageInstructors;
