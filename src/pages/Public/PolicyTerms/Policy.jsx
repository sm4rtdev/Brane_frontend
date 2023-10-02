import React, { useContext } from "react";

import "./PolicyTerms.scss";

import PageTransition from "../../../components/PageTransition/PageTransition";
import PublicHeader from "../../../components/PublicHeader/PublicHeader";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import { UserDataContext } from "../../../contexts/UserDataContext";

const Policy = () => {
  const { userData } = useContext(UserDataContext);

  return (
    <div id="policy-terms" className="page">
      <PageTransition margin>
        {userData.jwt ? <Header /> : <PublicHeader />}

        <div className="main">
          <h1>Política de privacidad</h1>

          <div className="content">
            <p>
              La presente Política de Privacidad establece los términos con que
              BRANE usa y protege la información que es proporcionada por sus
              usuarios al momento de utilizar su app. Esta compañía está
              comprometida con la seguridad de los datos de sus usuarios.
            </p>

            <h3>1. INFORMACIÓN DEL SITIO Y GENERALIDADES:</h3>

            <p>
              La presente Política de Privacidad se aplica a la utilización de
              los datos personales de cualquier persona que visite o se registre
              en la web y/o aplicación de BRANE, provista por BRANE.
            </p>

            <p className="uppercase">
              AL ACCEDER, CONECTARSE, REGISTRARSE O DE CUALQUIER OTRA FORMA
              UTILIZAR LA WEB Y/O EL APP, EL USUARIO CONFIRMA QUE LEYÓ,
              ENTENDIÓ, CONSINTIÓ Y ACEPTÓ LOS TÉRMINOS Y CONDICIONES DE ESTA
              POLÍTICA DE PRIVACIDAD. SI NO ESTÁ DE ACUERDO CON LOS TÉRMINOS DE
              ESTA POLÍTICA DE PRIVACIDAD, EL USUARIO NO DEBE UTILIZAR LA WEB,
              APP, PLATAFORMA DE CONTENIDO NI LOS CANALES DE COMUNICACIÓN DE
              BRANE.{" "}
              <strong>
                SI NO ESTÁ DE ACUERDO CON LOS TÉRMINOS DE ESTA POLÍTICA DE
                PRIVACIDAD, EL USUARIO NO DEBE UTILIZAR LA WEB, APP, PLATAFORMA
                DE CONTENIDO NI LOS CANALES DE COMUNICACIÓN DE BRANE.
              </strong>
            </p>

            <h3>2. RESPONSABLE DE TRATAMIENTO DE SUS DATOS PERSONALES:</h3>

            <p>
              BRANE es una sociedad responsable del tratamiento de los Datos
              Personales que el Usuario facilite en la App, o que se recopilen o
              procesen en la App. En cualquier caso, cualesquiera recopilación,
              uso e información compartida en relación con sus Datos Personales,
              el Usuario quedará sujeto a esta Política, sus actualizaciones y
              la política de cookies complementaria.
            </p>

            <h3>3. BASES LEGALES:</h3>

            <p>
              BRANE procesa la información personal del Usuario sobre las
              siguientes bases legales: a) consentimiento libre, expreso e
              informado de los titulares de datos; b) cumplimiento de todo
              acuerdo contractual con los titulares de datos; c) cumplimiento de
              obligaciones legales; d) intereses legítimos autorizados por la
              LPDP.
            </p>

            <h2>INFORMACIÓN RECOGIDA:</h2>

            <p>
              Nuestra Web y/o App podrá recoger información personal, por
              ejemplo: Nombre, información de contacto (como su dirección de
              correo electrónico, teléfono e información demográfica,
              comportamientos de uso y consumo).
            </p>

            <h3>1. FINALIDAD DE LA INFORMACIÓN RECOGIDA:</h3>

            <p>
              Nuestra Web y/o App emplea la información con el fin de
              proporcionar el mejor servicio al usuario, particularmente para
              mantener un registro de usuarios, de pedidos en caso que aplique,
              gestionar, analizar, desarrollar, personalizar y mejorar la App,
              nuestros productos y servicios.
            </p>

            <h3>2. COOKIES:</h3>

            <p>
              Una cookie es un fichero que es enviado con la finalidad de
              solicitar permiso para almacenarse en su ordenador. Nuestra app
              emplea las cookies para poder identificar las páginas que son
              visitadas y su frecuencia.
            </p>

            <h3>3. CON QUIÉN SE COMPARTE TU INFORMACIÓN PERSONAL:</h3>

            <p>
              BRANE jamás venderá tu información personal sin tu consentimiento.
              Tampoco revelaremos a terceros tu información personal sin tu
              consentimiento.
            </p>

            <h2>ENLACES A TERCEROS:</h2>

            <p>
              Tanto la Web y/o App de BRANE pudieran contener enlaces a otros
              sitios que pudieran ser de su interés.
            </p>

            <h2>CONTROL DE SU INFORMACIÓN PERSONAL:</h2>

            <p>
              En cualquier momento usted puede restringir la recopilación o el
              uso de la información personal que es proporcionada a nuestra web
              y/o App. Cada vez que se le solicite rellenar un formulario, como
              el de alta de usuario, puede marcar o desmarcar la opción de
              recibir información por correo electrónico.
            </p>

            <h2>CONFIDENCIALIDAD Y SEGURIDAD DE LA INFORMACIÓN:</h2>

            <p>
              BRANE ha adoptado medidas de seguridad razonables para proteger la
              información del Usuario e impedir el acceso no autorizado a sus
              datos o cualquier modificación, divulgación o destrucción no
              autorizada de los mismos.
            </p>

            <h3>1. CONSERVACIÓN DE LA INFORMACIÓN:</h3>

            <p>
              BRANE conservará los datos personales por el tiempo que sea
              necesario para el cumplimiento de las finalidades por las que
              fueron recolectados.
            </p>

            <h3>2. DERECHOS DEL USUARIO SOBRE LA INFORMACIÓN:</h3>

            <p>
              El Usuario tiene los siguientes derechos con relación a sus datos
              personales: a) Solicitar el acceso a sus datos; b)Rectificar datos
              incompletos o inexactos que se relacionen con su persona; c)
              Solicitar a BRANE que elimine sus datos cuando no haya base legal
              para que sigan procesando dichos datos; d)Retirar cualquier
              consentimiento que haya proporcionado para el tratamiento de tus
              datos personales.
            </p>

            <h3>3. MODIFICACIÓN DE LA POLÍTICA DE PRIVACIDAD:</h3>

            <p>
              Esta Política está sujeta a cambios y actualizaciones. El Usuario
              debe revisar la Política regularmente para asegurarse de que está
              familiarizado con su contenido.
            </p>
          </div>
        </div>
        <Footer unique />
      </PageTransition>
    </div>
  );
};

export default Policy;
