import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import "./SignupBox.scss";

import { LogoApple, LogoFacebook } from "../../../../assets/icons";

import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import { postRegister } from "../../../../api/postRegister";

const SignupBox = () => {
  const boxContainer = useRef(null);
  const [loginButtonSize, setLoginButtonSize] = useState(448);

  useEffect(() => {
    window.addEventListener("resize", (e) => {
      setTimeout(() => {
        if (boxContainer.current) {
          // console.log(boxContainer.current.offsetWidth);
          setLoginButtonSize(boxContainer.current.offsetWidth);
        }
      }, 0);
    });
  }, []);

  useEffect(() => {
    /* global google */
    setTimeout(() => {
      if (boxContainer.current) {
        setLoginButtonSize(boxContainer.current.offsetWidth);
      }

      google.accounts.id.renderButton(
        document.getElementById("continue-with-google"),
        {
          theme: "outline",
          size: "large",
          width: loginButtonSize - 96,
          shape: "pill",
        } // customization attributes
      );
    }, 0);
  }, [loginButtonSize]);

  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [screen, setScreen] = useState(0);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    repeatedPassword: "",
  });

  const register = async () => {
    const { ok, data } = await postRegister({
      email: inputs.email,
      username: inputs.email,
      password: inputs.password,
    });

    if (ok) {
      toast.success("Éxito!");

      setScreen(1);
    } else {
      toast.error(`${data.error.message}`);
      setIsLoading(false);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();

    setIsLoading(true);

    register();
  };

  useEffect(() => {
    if (
      inputs.email !== "" &&
      inputs.password === inputs.repeatedPassword &&
      inputs.password !== ""
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [inputs]);

  return (
    <div id="signup-box" className="auth-box" ref={boxContainer}>
      {screen === 0 ? (
        <>
          <h1>Regístrate</h1>
          <p className="not-first-time">
            ¿Ya tienes una cuenta? <Link to="/auth/login">Iniciar sesión</Link>
          </p>

          <form>
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
              placeholder={"Confirmar contraseña"}
            />

            <button
              className="action-button"
              onClick={handleClick}
              disabled={isLoading || isDisabled}
            >
              {isLoading && <SpinnerOfDoom />}
              Registrarse
            </button>
          </form>

          <p className="conditions">
            Al hacer clic en "Registrarse", usted acepta nuestros{" "}
            <Link to={"/terms"}>términos de servicio</Link> y{" "}
            <Link to={"/privacy"}>políticas de privacidad</Link>.
          </p>

          <div className="separator">
            <span>O</span>
          </div>

          <div className="continue-with-google">
            <div id="continue-with-google"></div>
          </div>

          <button className="continue-with-facebook">
            <LogoFacebook />
            <p>Continuar con Facebook</p>
          </button>

          <button className="continue-with-apple">
            <LogoApple />
            <p>Continuar con Apple</p>
          </button>
        </>
      ) : (
        <>
          <h1>Casi listo</h1>

          <p className="conditions">
            Para comenzar a usar su cuenta, haga clic en el enlace de
            verificación que le enviamos a su correo electrónico.
          </p>
        </>
      )}
    </div>
  );
};

export default SignupBox;
