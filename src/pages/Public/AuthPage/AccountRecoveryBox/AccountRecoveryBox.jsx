import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "./AccountRecoveryBox.scss";

import { RAIOne, RAITwo } from "../../../../assets/images";
import { ChevronForward } from "../../../../assets/icons";

import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import { postSendResetEmail } from "../../../../api/postSendResetEmail";
import { postResetPassword } from "../../../../api/postResetPassword";

const AccountRecoveryBox = () => {
  const navigate = useNavigate();

  const useQuery = () => {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
  };

  let query = useQuery();

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    repeatedPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(null);
  const [codeSent, setCodeSent] = useState(false);

  useEffect(() => {
    let code = query.get("code");

    if (code !== undefined) {
      setCode(code);
    }

    //eslint-disable-next-line
  }, []);

  const sendResetEmail = async () => {
    setLoading(true);
    const { ok, data } = await postSendResetEmail({
      email: inputs.email,
    });

    console.log(data);

    if (ok) {
      toast.success("Se ha enviado un enlace de recuperación.");
      setCodeSent(true);
    } else {
      toast.error(`${data.error.message}`);
    }

    setLoading(false);
  };

  const resetPassword = async () => {
    setLoading(true);

    const { ok, data } = await postResetPassword({
      code,
      password: inputs.password,
      passwordConfirmation: inputs.repeatedPassword,
    });

    console.log(data);

    if (ok) {
      toast.success("Contraseña cambiada con éxito");

      navigate("login");
    } else {
      toast.error(`${data.error.message}`);
      setLoading(false);
    }
  };

  return (
    <div id="account-recovery-box" className="auth-box">
      <div className="title">
        <Link to="/login" className="go-back">
          <ChevronForward />
        </Link>
        <strong className="title-section">Recuperación de Cuenta</strong>
      </div>
      {!code ? (
        <>
          <div className="illustration">
            <RAIOne />
          </div>
          <p>
            ¿Olvidaste la contraseña de tu cuenta? Ingrese su dirección de
            correo electrónico y le enviaremos un enlace de recuperación.
          </p>
          <div className="form">
            <DynamicInput
              id={"email"}
              type={"email"}
              state={[inputs, setInputs]}
            />

            <button
              className="action-button"
              onClick={sendResetEmail}
              disabled={codeSent || inputs.email === ""}
            >
              {loading && <SpinnerOfDoom />}
              {codeSent ? "Enlace enviado" : "Recuperar cuenta"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="illustration">
            <RAITwo />
          </div>
          <p>Introduzca su nueva contraseña</p>
          <div className="form" id="second">
            <DynamicInput
              id={"password"}
              type={"password"}
              state={[inputs, setInputs]}
            />
            <DynamicInput
              id={"repeatedPassword"}
              type={"password"}
              state={[inputs, setInputs]}
              placeholder={"Confirmar contraseña"}
            />

            <button
              className="action-button"
              onClick={resetPassword}
              disabled={
                inputs.password === "" || inputs.repeatedPassword === ""
              }
            >
              {loading && <SpinnerOfDoom />}
              Confirmar
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AccountRecoveryBox;
