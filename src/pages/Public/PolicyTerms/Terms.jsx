import React, { useContext } from "react";

import PageTransition from "../../../components/PageTransition/PageTransition";
import PublicHeader from "../../../components/PublicHeader/PublicHeader";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { UserDataContext } from "../../../contexts/UserDataContext";

const Terms = () => {
  const { userData } = useContext(UserDataContext);

  return (
    <div id="policy-terms" className="page">
      <PageTransition margin>
        {userData.jwt ? <Header /> : <PublicHeader />}

        <div className="main">
          <h1>Términos de servicio</h1>

          <div className="content">
            <p>
              Bienvenido a Brane, una plataforma de aprendizaje en línea que te
              ofrece cursos de alta calidad impartidos por expertos en la
              materia. Al usar nuestros Servicios, aceptas los siguientes
              términos y condiciones, que rigen nuestra relación contigo en
              relación con los Servicios. Los presentes Términos y Condiciones
              de uso (“Condiciones”) regulan el acceso o uso que usted haga,
              como persona o empresa, desde cualquier país del mundo de
              aplicaciones, páginas web, contenidos, productos, cursos,
              talleres, conferencias, diplomados y cualquier otro servicio,
              (“Los Servicios”) puestos a disposición por Brane LTD y sus
              subsidiarias, una sociedad de responsabilidad limitada constituida
              en los Estados Unidos
            </p>

            <h3>1. Introducción:</h3>

            <p>
              Brane es una plataforma de aprendizaje en línea que te ofrece
              cursos de alta calidad impartidos por expertos en la materia. Al
              usar nuestros Servicios, aceptas los siguientes términos y
              condiciones, que rigen nuestra relación contigo en relación con
              los Servicios.
            </p>

            <h3>2. Uso de los Servicios:</h3>

            <p>
              Puedes usar nuestros Servicios solo para fines legales y de
              conformidad con estos Términos. No estás autorizado para utilizar
              nuestros Servicios si no puedes celebrar contratos vinculantes con
              Brane, si eres menor de edad o si te han suspendido o prohibido el
              uso de los Servicios.
            </p>

            <h3>3. Contenido y propiedad intelectual:</h3>

            <p>
              La plataforma Brane, el contenido de los cursos y todo el material
              relacionado, incluidos, entre otros, texto, gráficos, imágenes,
              fotografías, audio, música, videos, software, códigos, títulos,
              diseños, palabras clave, conceptos y temas, se encuentran
              protegidos por leyes de derechos de autor, marcas registradas y
              otras leyes de propiedad intelectual aplicables.
            </p>

            <h3>4. Política de privacidad:</h3>

            <p>
              En Brane, nos tomamos muy en serio tu privacidad y nuestra
              Política de privacidad describe cómo recopilamos, utilizamos y
              compartimos tus datos personales.
            </p>

            <h3>5. Pago y renovación de cursos :</h3>

            <p>
              Los cursos, talleres, diplomados o carreras de Brane pueden tener
              un precio y se pueden adquirir individualmente o como parte de una
              suscripción. Los precios de los cursos se indican en la plataforma
              y pueden cambiar en cualquier momento. Al comprar un curso,
              aceptas pagar el precio indicado en la plataforma.
            </p>

            <h3>6. Cancelación y reembolso de cursos:</h3>

            <p>
              En Brane, queremos que estés satisfecho con los cursos que
              adquieras. Por lo tanto, ofrecemos una política de cancelación y
              reembolso justa y transparente.
            </p>

            <h3>7. Derechos de propiedad intelectual:</h3>

            <p>
              Respetamos los derechos de propiedad intelectual de terceros y
              esperamos que nuestros usuarios y tutores hagan lo mismo. Si crees
              que tu trabajo ha sido copiado de una manera que constituye una
              infracción de derechos de autor, comunicate con nosotros
              legal@brane.com y trataremos de resolver el problema de manera
              justa y rápida.
            </p>

            <h3>8. Garantías y exenciones de responsabilidad:</h3>

            <p>
              Los cursos, talleres, conferencias y demás servicios se
              proporcionan "tal cual" y sin garantía de ningún tipo, ya sea
              expresa o implícita. Brane no garantiza que los cursos satisfagan
              tus necesidades o expectativas y no se hace responsable de ningún
              daño directo, indirecto, incidental, especial, punitivo o
              consecuente que surja del uso o la incapacidad de uso de los
              Servicios.
            </p>

            <h3>9. Indemnización:</h3>

            <p>
              Al usar nuestros Servicios, aceptas indemnizar, defender y eximir
              de responsabilidad a Brane y a sus empleados, representantes y
              agentes, frente a cualquier reclamación, acción legal, demanda,
              pérdida, responsabilidad, daño, costo y gasto (incluidos, entre
              otros, los honorarios razonables de los abogados) que surjan de tu
              incumplimiento de estos Términos o del uso de los Servicios.
            </p>

            <h3>10. Resolución de conflictos:</h3>

            <p>
              Cualquier conflicto relacionado con estos Términos se resolverá
              mediante arbitraje de conformidad con las normas de arbitraje.
            </p>
          </div>
        </div>
        <Footer unique />
      </PageTransition>
    </div>
  );
};

export default Terms;
