import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import "./InsSignupBox.scss";

import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";
import { postInsRegister } from "../../../../api/postInsRegister";

const InsSignupBox = () => {
  const { dictionary, language } = useContext(DictionaryContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [screen, setScreen] = useState(0);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    repeatedPassword: "",
    nombre: "",
    posicion: "",
    telefono: "",
    encargado: "",
  });

  const insRegister = async () => {
    const { ok, data } = await postInsRegister({
      data: {
        email: inputs.email,
        username: inputs.email,
        password: inputs.password,
        nombre: inputs.nombre,
        posicion: inputs.posicion,
        telefono: inputs.telefono,
        encargado: inputs.encargado,
      },
    });

    if (ok) {
      toast.success(dictionary.login.done[language]);

      setScreen(1);
    } else {
      toast.error(`${data.error.message}`);
      setIsLoading(false);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();

    setIsLoading(true);

    insRegister();
  };

  useEffect(() => {
    if (
      inputs.email !== "" &&
      inputs.password === inputs.repeatedPassword &&
      inputs.password !== "" &&
      inputs.nombre !== "" &&
      inputs.posicion !== "" &&
      inputs.telefono !== "" &&
      inputs.encargado !== ""
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [inputs]);

  return (
    <div id="ins-signup-box" className="auth-box">
      {screen === 0 ? (
        <>
          <h1>{dictionary.signup[0][language]}</h1>
          <p className="not-first-time">
            {dictionary.signup[1][language] + " "}
            <Link to="/ins-auth/login">{dictionary.signup[2][language]}</Link>
          </p>

          <form>
            <DynamicInput
              id={"nombre"}
              state={[inputs, setInputs]}
              noIcon
              placeholder={dictionary.insSignup[0][language]}
            />
            <DynamicInput
              id={"encargado"}
              state={[inputs, setInputs]}
              placeholder={dictionary.insSignup[1][language]}
              noIcon
            />
            <DynamicInput
              id={"posicion"}
              state={[inputs, setInputs]}
              placeholder={dictionary.insSignup[2][language]}
              noIcon
            />
            <DynamicInput
              id={"telefono"}
              type={"tel"}
              state={[inputs, setInputs]}
              placeholder={dictionary.insSignup[3][language]}
              noIcon
            />
            <DynamicInput id={"email"} type={"email"} state={[inputs, setInputs]} />
            <DynamicInput id={"password"} type={"password"} state={[inputs, setInputs]} />
            <DynamicInput
              id={"repeatedPassword"}
              type={"password"}
              state={[inputs, setInputs]}
              placeholder={dictionary.insSignup[4][language]}
            />

            <button className="action-button" onClick={handleClick} disabled={isLoading || isDisabled}>
              {isLoading && <SpinnerOfDoom />}
              {dictionary.insSignup[5][language]}
            </button>
          </form>

          <p className="conditions">
            {dictionary.insSignup[6][language] + " "} <Link to={"/terms"}>{dictionary.insSignup[7][language]}</Link>{" "}
            {dictionary.insSignup[8][language]} <Link to={"/privacy"}>{dictionary.insSignup[9][language]}</Link>.
          </p>
        </>
      ) : (
        <>
          <h1>{dictionary.insSignup[10][language]}</h1>

          <p className="conditions">{dictionary.insSignup[11][language]}</p>
        </>
      )}
    </div>
  );
};

export default InsSignupBox;
