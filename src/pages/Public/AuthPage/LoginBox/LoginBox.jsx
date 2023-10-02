import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import "./LoginBox.scss";

import { LogoApple, LogoFacebook } from "../../../../assets/icons";

import {
  removeFromLocal,
  getFromLocal,
  updateLocal,
} from "../../../../helpers/localStorage";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import { UserDataContext } from "../../../../contexts/UserDataContext";
import { postMetaBusiness } from "../../../../api/postMetaBusiness";
import { postUserMetadata } from "../../../../api/postUserMetadata";
import { postLogin } from "../../../../api/postLogin";
import { putUser } from "../../../../api/putUser";
import { getUser } from "../../../../api/getUser";
import { getUserMetadata } from "../../../../api/getUserMetadata";
import { getCompanyMeta } from "../../../../api/getCompanyMeta";
import { getInstitutionMetadata } from "../../../../api/getInstitutionMetadata";
import { postMetaInstitution } from "../../../../api/postMetaInstitution";

const LoginBox = ({ institutions }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const boxContainer = useRef(null);

  // Google Button
  const [loginButtonSize, setLoginButtonSize] = useState(448);

  useEffect(() => {
    window.addEventListener("resize", (e) => {
      setTimeout(() => {
        if (boxContainer.current) {
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

  // Trigger message on confirmation
  useEffect(() => {
    if (searchParams.get("confirmed")) {
      toast.success("El correo electrónico ha sido verificado exitosamente.");
    }
  }, []); //eslint-disable-line

  // ------------------------- Login Flow ------------------------------

  const { userData, updateUserData } = useContext(UserDataContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isDisabledPost, setIsDisabledPost] = useState(true);
  const [screen, setScreen] = useState(0);
  const [userID, setUserID] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Login data
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const runAuth = async () => {
    if (getFromLocal("loggedUser")) {
      removeFromLocal("loggedUser");
    }

    const { ok, data } = await postLogin({
      identifier: inputs.email,
      password: inputs.password,
    });

    console.log(data);

    if (ok) {
      updateLocal("tempUser", data.jwt);

      (async () => {
        //Get role
        const { ok, data: roleRes } = await getUser(true);

        if (ok) {
          const { role } = roleRes;

          // console.log(role);

          // Check Meta
          (async (role) => {
            let res;

            // Company
            if (role.id === 4) {
              res = await getCompanyMeta(true);
            }
            // Institution
            else if (role.id === 6) {
              res = await getInstitutionMetadata(true);
            }
            // Student or Instructor
            else {
              res = await getUserMetadata(true);
            }

            const { ok } = res;

            // Successful login
            if (ok) {
              toast.success("Acceso exitoso");
              updateLocal("loggedUser", data.jwt);
              updateUserData({ jwt: data.jwt });
            }
            // Post Registration
            else {
              setUserInfo(roleRes);
              setUserID(data.user.id);

              // Company
              if (role.id === 4) {
                setScreen(2);
              }
              // Institution
              else if (role.id === 6) {
                setScreen(3);
              }
              // Student or Instructor
              else {
                setScreen(1);
              }

              setIsLoading(false);
            }
          })(role);
        } else {
          toast.error(`${roleRes.error.message}`);
        }
      })();
    } else {
      toast.error(`${data.error.message}`);
      setIsLoading(false);
    }
  };

  // Post login
  useEffect(() => {
    if (userData.info) {
      if (userData.instructor) {
        navigate("/role");
      } else {
        navigate("/");
      }
    }
  }, [userData]); //eslint-disable-line

  const runPostRegister = async () => {
    // Company
    if (screen === 2) {
      const newSlug = {
        slug: `${userInfo.nombre.toLowerCase()}${(
          Math.random() * 1000
        ).toFixed()}`,
      };

      const { ok: PUTState, data: PUTData } = await putUser(
        userID,
        newSlug,
        true
      );

      if (PUTState) {
        const objMetadata = {
          data: {
            user: userID,
            notificacion_promocion: true,
            notificacion_mensajes: true,
            notificacion_anuncios_instructores: true,
            numberOfWorkers: inputsPRBusiness.numberOfWorkers,
            description: inputsPRBusiness.description,
            foundationDate: inputsPRBusiness.foundationDate,
            address: inputsPRBusiness.address,
          },
        };

        const { ok, data } = await postMetaBusiness(objMetadata);

        console.log(data);

        if (ok) {
          toast.success("Post registration completed");

          setTimeout(() => {
            runAuth();
          }, 300);
        } else {
          toast.error(`${data.error.message}`);
          setIsLoading(false);
        }
      } else {
        toast.error(`${PUTData.error.message}`);
        setIsLoading(false);
      }
    }
    // Institution
    else if (screen === 3) {
      const newSlug = {
        slug: `${userInfo.nombre.toLowerCase()}${(
          Math.random() * 1000
        ).toFixed()}`,
      };

      const { ok: PUTState, data: PUTData } = await putUser(
        userID,
        newSlug,
        true
      );

      if (PUTState) {
        const objMetadata = {
          data: {
            description: inputsPRInstitutions.description,
            foundationDate: inputsPRInstitutions.foundationDate,
            address: inputsPRInstitutions.address,
          },
        };

        const { ok, data } = await postMetaInstitution(objMetadata);

        console.log(data);

        if (ok) {
          toast.success("Post-Registro completado");

          setTimeout(() => {
            runAuth();
          }, 300);
        } else {
          toast.error(`${data.error.message}`);
          setIsLoading(false);
        }
      } else {
        toast.error(`${PUTData.error.message}`);
        setIsLoading(false);
      }
    }
    // Student or Instructor
    else {
      const objMetadata = {
        data: {
          notificacion_promocion: true,
          notificacion_mensajes: true,
          notificacion_anuncios_instructores: true,
          profesion: inputsPRUser.occupation,
          biografia: "",
          birthday: inputsPRUser.birthdate,
          address: inputsPRUser.location,
        },
      };

      const { ok, data } = await postUserMetadata(objMetadata);

      console.log(data);

      if (ok) {
        const objUser = {
          nombre: inputsPRUser.firstName,
          apellidos: inputsPRUser.lastName,
        };

        const { ok, data } = await putUser(userID, objUser, true);

        console.log(data);

        if (ok) {
          toast.success("Post-Registro completado");

          setTimeout(() => {
            runAuth();
          }, 300);
        } else {
          toast.error(`${data.error.message}`);
          setIsLoading(false);
        }
      } else {
        toast.error(`${data.error.message}`);
        setIsLoading(false);
      }
    }
  };

  const handleClick = (e) => {
    e.preventDefault();

    setIsLoading(true);

    runAuth();
  };

  const handleClickPost = (e) => {
    e.preventDefault();

    setIsLoading(true);

    runPostRegister();
  };

  // Handle login disable state
  useEffect(() => {
    if (!inputs.email || !inputs.password) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [inputs]);

  const [inputsPRUser, setInputsPRUser] = useState({
    firstName: "",
    lastName: "",
    birthdate: "",
    occupation: "",
    location: "",
  });

  const [inputsPRBusiness, setInputsPRBusiness] = useState({
    notificacion_promocion: true,
    notificacion_mensajes: true,
    notificacion_anuncios_instructores: true,
    numberOfWorkers: "",
    description: "",
    foundationDate: "",
    address: "",
  });

  const [inputsPRInstitutions, setInputsPRInstitutions] = useState({
    description: "",
    foundationDate: "",
    address: "",
  });

  // Handle post-register button disabled state
  useEffect(() => {
    if (
      !inputsPRUser.firstName ||
      inputsPRUser.firstName.length < 2 ||
      inputsPRUser.lastName.length < 3 ||
      !inputsPRUser.lastName ||
      !inputsPRUser.birthdate ||
      !inputsPRUser.location ||
      !inputsPRUser.occupation
    ) {
      setIsDisabledPost(true);
    } else {
      setIsDisabledPost(false);
    }
  }, [inputsPRUser]);

  return (
    <div id="login-box" className="auth-box" ref={boxContainer}>
      {screen === 0 ? (
        <>
          <h1>Bienvenido</h1>
          <p className="below">Inicie sesión en su cuenta Brane</p>

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
            <Link className="recover-password" to="/auth/account-recovery">
              Has olvidado tu contraseña?
            </Link>

            <button
              className="action-button"
              onClick={handleClick}
              disabled={isLoading || isDisabled}
            >
              {isLoading && <SpinnerOfDoom />}
              Iniciar sesión
            </button>
          </form>

          <p className="first-time">
            No tienes una cuenta?{" "}
            <Link to={institutions ? "/ins-auth/signup" : "/auth/signup"}>
              Regístrate
            </Link>
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
      ) : screen === 1 ? (
        <>
          <h2>Gracias por registrarte</h2>
          <p className="below">
            Ingrese la siguiente información para continuar a la aplicación
          </p>

          <form autoComplete="off">
            <DynamicInput
              id={"firstName"}
              state={[inputsPRUser, setInputsPRUser]}
              noIcon
              placeholder={"Nombre"}
              label="Nombre"
            />
            <DynamicInput
              id={"lastName"}
              state={[inputsPRUser, setInputsPRUser]}
              noIcon
              placeholder={"Apellido"}
              label="Apellido"
            />
            <DynamicInput
              id={"birthdate"}
              type="date"
              state={[inputsPRUser, setInputsPRUser]}
              noIcon
              label="Fecha de nacimiento"
            />
            <DynamicInput
              id={"occupation"}
              state={[inputsPRUser, setInputsPRUser]}
              noIcon
              placeholder={"Ocupación"}
              label="Ocupación"
            />
            <DynamicInput
              id={"location"}
              state={[inputsPRUser, setInputsPRUser]}
              noIcon
              placeholder={"Ubicación"}
              label="Ubicación"
            />

            <button
              className="action-button"
              onClick={handleClickPost}
              disabled={isLoading || isDisabledPost}
            >
              {isLoading && <SpinnerOfDoom />}
              Continuar
            </button>
          </form>
        </>
      ) : screen === 2 ? (
        <>
          <h2>Gracias por registrarte</h2>
          <p className="below">
            Ingrese la siguiente información para continuar a la aplicación
          </p>

          <form autoComplete="off">
            <DynamicInput
              id={"description"}
              state={[inputsPRBusiness, setInputsPRBusiness]}
              noIcon
              placeholder={"Descripción del negocio"}
              label="Descripción del negocio"
            />
            <DynamicInput
              id={"numberOfWorkers"}
              state={[inputsPRBusiness, setInputsPRBusiness]}
              type="number"
              number
              noIcon
              placeholder={"Numero de empleados"}
              label="Numero de empleados"
            />
            <DynamicInput
              id={"foundationDate"}
              state={[inputsPRBusiness, setInputsPRBusiness]}
              type="date"
              noIcon
              label="Fecha de fundación de la empresa"
            />
            <DynamicInput
              id={"address"}
              state={[inputsPRBusiness, setInputsPRBusiness]}
              noIcon
              placeholder={"Dirección física del negocio"}
              label="Dirección física del negocio"
            />

            <button
              className="action-button"
              onClick={handleClickPost}
              disabled={
                isLoading ||
                !inputsPRBusiness.address ||
                !inputsPRBusiness.description ||
                !inputsPRBusiness.foundationDate ||
                !inputsPRBusiness.numberOfWorkers
              }
            >
              {isLoading && <SpinnerOfDoom />}
              Continuar
            </button>
          </form>
        </>
      ) : (
        <>
          <h2>Gracias por registrarte</h2>
          <p className="below">
            Ingrese la siguiente información para continuar a la aplicación
          </p>

          <form autoComplete="off">
            <DynamicInput
              id={"description"}
              state={[inputsPRInstitutions, setInputsPRInstitutions]}
              noIcon
              placeholder={"Descripción de la Institución"}
              label="Descripción de la Institución"
            />
            <DynamicInput
              id={"foundationDate"}
              state={[inputsPRInstitutions, setInputsPRInstitutions]}
              type="date"
              noIcon
              label="Fecha de fundación de la Institución"
            />
            <DynamicInput
              id={"address"}
              state={[inputsPRInstitutions, setInputsPRInstitutions]}
              noIcon
              placeholder={"Dirección física de la Institución"}
              label="Dirección física de la Institución"
            />

            <button
              className="action-button"
              onClick={handleClickPost}
              disabled={
                isLoading ||
                !inputsPRInstitutions.description ||
                !inputsPRInstitutions.foundationDate ||
                !inputsPRInstitutions.address
              }
            >
              {isLoading && <SpinnerOfDoom />}
              Continuar
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default LoginBox;
