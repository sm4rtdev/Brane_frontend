import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import "./InsSignupBox.scss";

import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import { postInsRegister } from "../../../../api/postInsRegister";

const InsSignupBox = () => {
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
      toast.success("Success!");

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
          <h1>Sign up</h1>
          <p className="not-first-time">
            Already have an account? <Link to="/ins-auth/login">Log in</Link>
          </p>

          <form>
            <DynamicInput
              id={"nombre"}
              state={[inputs, setInputs]}
              noIcon
              placeholder="Name of the Institution"
            />
            <DynamicInput
              id={"encargado"}
              state={[inputs, setInputs]}
              placeholder="Your name"
              noIcon
            />
            <DynamicInput
              id={"posicion"}
              state={[inputs, setInputs]}
              placeholder="Your position"
              noIcon
            />
            <DynamicInput
              id={"telefono"}
              type={"tel"}
              state={[inputs, setInputs]}
              placeholder="Phone Number"
              noIcon
            />
            <DynamicInput
              id={"email"}
              type={"email"}
              state={[inputs, setInputs]}
            />
            <DynamicInput
              id={"password"}
              type={"password"}
              state={[inputs, setInputs]}
            />
            <DynamicInput
              id={"repeatedPassword"}
              type={"password"}
              state={[inputs, setInputs]}
              placeholder={"Confirm Password"}
            />

            <button
              className="action-button"
              onClick={handleClick}
              disabled={isLoading || isDisabled}
            >
              {isLoading && <SpinnerOfDoom />}
              Contact adviser
            </button>
          </form>

          <p className="conditions">
            By clicking “Contact adviser”, you agree to our{" "}
            <Link to={"/terms"}>terms of service</Link> and{" "}
            <Link to={"/privacy"}>privacy policy</Link>.
          </p>
        </>
      ) : (
        <>
          <h1>Almost ready</h1>

          <p className="conditions">
            Un asesor se pondrá en contacto contigo para brindarte información
            detallada, así como verificar la existencia de la institución
            legalmente.
          </p>
        </>
      )}
    </div>
  );
};

export default InsSignupBox;
