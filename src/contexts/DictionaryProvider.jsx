import React, { useState } from "react";

import { DictionaryContext } from "./DictionaryContext";

const dictionary = {
  institutions: {
    bannerTitle: { es: "Impulsa tu comunidad", en: "Boost your community" },
    bannerText: {
      es: "Con Brane, podrás aumentar el alcance de tu institución. Llega a más profesionales interesados en tus servicios.",
      en: "With Brane, you can increase the reach of your institution. Reach more professionals interested in your services.",
    },
    bannerButton: { es: "Más información", en: "More information" },
    howTitle: { es: "Cómo empezar", en: "How to start" },
    howList: {
      title: { es: "Construye tu equipo", en: "Build your team" },
      items: [
        { es: "Crea tu cuenta de Brane", en: "Create your Brane account" },
        { es: "Carga tus cursos", en: "Upload your courses" },
        {
          es: "Busca a profesionales y agrégalos a tu comunidad",
          en: "Find professionals and add them to your community",
        },
      ],
    },
    becomeTitle: {
      es: "No esperes más, comienza hoy",
      en: "Don't wait any longer, start today",
    },
    becomeText: {
      es: "Estás más cerca de llevar tu institución al siguiente nivel",
      en: "You are closer to taking your institution to the next level",
    },
    becomeButton: {
      es: "Empieza ya!",
      en: "Start now!",
    },
  },
  footer: {
    first: [
      { es: "Blog", en: "Blog" },
      { es: "Contacto", en: "Contact" },
    ],
    second: [
      { es: "Cursos", en: "Courses" },
      { es: "Empresas", en: "Business" },
      { es: "Conviertete en instructor", en: "Become an instructor" },
      { es: "Centro de ayuda", en: "Help Center" },
    ],
    third: [
      { es: "Términos y políticas", en: "Terms and policies" },
      { es: "Política de privacidad", en: "Privacy Policy" },
      { es: "Términos de servicio", en: "Terms of Service" },
    ],
    fourth: [
      { es: "Boletin informativo", en: "Newsletter" },
      { es: "Nombre", en: "Name" },
      { es: "Correo electrónico", en: "Email" },
      { es: "Suscríbete!", en: "Subscribe!" },
    ],
    copy: { es: "Desarrollado por", en: "Developed by" },
  },
  header: {
    msgDropdown: {
      tabs: [
        { es: "Estudiante", en: "Student" },
        { es: "Instructor", en: "Instructor" },
      ],
      text: { es: "Sin datos", en: "No data" },
      button: { es: "Ver más", en: "See more" },
    },
    search: { es: "Buscar", en: "Search" },
    greeting: [
      { es: "Buen día", en: "Good day" },
      { es: "Buenas tardes", en: "Good afternoon" },
      { es: "Buenas noches", en: "Good evening" },
    ],
    nav: [
      { es: "Inicio", en: "Start" },
      { es: "Cursos", en: "Courses" },
      { es: "Conferencias", en: "Conferences" },
      { es: "Empresas", en: "Business" },
      { es: "Instructores", en: "Instructors" },
      { es: "Instituciones", en: "Institutions" },
    ],
    auth: [
      { es: "Iniciar sesión", en: "Login" },
      { es: "Regístrate gratis", en: "Sign up for free" },
    ],
    dropdown: [
      { es: "Mis cursos", en: "My courses" },
      { es: "Lista de deseados", en: "Wish list" },
      { es: "Chat", en: "Chat" },
      { es: "Cambiar al modo Estudiante", en: "Switch to Student mode" },
      { es: "Cambiar al modo Instructor", en: "Switch to Instructor mode" },
      { es: "Perfil", en: "Profile" },
      { es: "Cerrar sesión", en: "Logout" },
    ],
  },
  searchHeader: {
    button: { es: "Búsqueda general", en: "General search" },
    filters: [
      { es: "Filtros", en: "Filters" },
      { es: "Estrellas", en: "Stars" },
      { es: "Precio", en: "Price" },
    ],
  },
};

const DictionaryProvider = ({ children }) => {
  const [language, setLanguage] = useState("es");

  const toggleLanguage = () => {
    if (language === "es") setLanguage("en");
    else setLanguage("es");
  };

  return (
    <DictionaryContext.Provider
      value={{ dictionary, language, toggleLanguage }}
    >
      {children}
    </DictionaryContext.Provider>
  );
};

export default DictionaryProvider;
