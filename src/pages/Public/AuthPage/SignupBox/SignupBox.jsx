import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import "./SignupBox.scss";

import { LogoApple, LogoFacebook, LogoGoogle } from "../../../../assets/icons";

import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";
import { getGoogleLogin } from "../../../../api/getGoogleLogin";
import { postRegister } from "../../../../api/postRegister";

const SignupBox = () => {
  const { dictionary, language } = useContext(DictionaryContext);

  const boxContainer = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [screen, setScreen] = useState(0);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    repeatedPassword: "",
  });

  const getGoogleWindow = async () => {
    setIsLoading(true);

    const { ok, data } = await getGoogleLogin();

    if (ok) {
      window.open(data.url, "_self");
    } else {
      toast.error(`${data.error.message}`);
    }

    setIsLoading(false);
  };

  const register = async () => {
    const { ok, data } = await postRegister({
      email: inputs.email,
      username: inputs.email,
      password: inputs.password,
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

    register();
  };

  useEffect(() => {
    if (inputs.email !== "" && inputs.password === inputs.repeatedPassword && inputs.password !== "") {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [inputs]);

  return (
    <div id="signup-box" className="auth-box" ref={boxContainer}>
      {screen === 0 ? (
        <>
          <h1>{dictionary.signup[0][language]}</h1>
          <p className="not-first-time">
            {dictionary.signup[1][language]} <Link to="/auth/login">{dictionary.signup[2][language]}</Link>
          </p>

          <form>
            <DynamicInput id={"email"} type={"email"} state={[inputs, setInputs]} />
            <DynamicInput id={"password"} type={"password"} state={[inputs, setInputs]} />
            <DynamicInput
              id={"repeatedPassword"}
              type={"password"}
              state={[inputs, setInputs]}
              placeholder={dictionary.signup[3][language]}
            />

            <button className="action-button" onClick={handleClick} disabled={isLoading || isDisabled}>
              {isLoading && <SpinnerOfDoom />}
              {dictionary.signup[4][language]}
            </button>
          </form>

          <p className="conditions">
            {dictionary.signup[5][language]} <Link to={"/terms"}>{dictionary.signup[6][language]}</Link>{" "}
            {dictionary.signup[7][language]} <Link to={"/privacy"}>{dictionary.signup[8][language]}</Link>.
          </p>

          <div className="separator">
            <span>{dictionary.signup[9][language]}</span>
          </div>

          <button className="continue-with-google" onClick={getGoogleWindow}>
            <LogoGoogle />
            <p>{dictionary.login.google[language]}</p>
          </button>

          <button className="continue-with-facebook">
            <LogoFacebook />
            <p>{dictionary.signup[10][language]}</p>
          </button>
        </>
      ) : (
        <>
          <h1>{dictionary.signup[12][language]}</h1>

          <p className="conditions">{dictionary.signup[13][language]}</p>
        </>
      )}
    </div>
  );
};

export default SignupBox;
