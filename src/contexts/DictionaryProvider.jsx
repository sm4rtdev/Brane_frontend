import React, { useEffect, useState } from "react";

import { DictionaryContext } from "./DictionaryContext";
import { getFromLocal, updateLocal } from "../helpers/localStorage";

const dictionary = {
  dynamicInput: [
    { es: "Correo electrónico", en: "Email" },
    { es: "Contraseña", en: "Password" },
    { es: "Buscar", en: "Search" },
  ],
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
  publicHeader: [
    { es: "Inicio", en: "Home" },
    { es: "Empresas", en: "Business" },
    { es: "Instructores", en: "Instructors" },
    { es: "Instituciones", en: "Institutions" },
    { es: "Iniciar sesión", en: "Log in" },
    { es: "Regístrate gratis", en: "Sign up free" },
  ],
  searchHeader: {
    button: { es: "Búsqueda general", en: "General search" },
    filters: [
      { es: "Filtros", en: "Filters" },
      { es: "Estrellas", en: "Stars" },
      { es: "Precio", en: "Price" },
    ],
  },
  landingPage: {
    banner: [
      {
        es: "Comienza a impulsar tu carrera profesional hoy",
        en: "Start boosting your career today",
      },
      {
        es: "Prepárate para el éxito y obtén las herramientas necesarias para triunfar en un mundo cada vez más competitivo.",
        en: "Prepare for success and obtain the tools necessary to succeed in an increasingly competitive world.",
      },
      {
        es: "Empieza hoy!",
        en: "Get started today!",
      },
    ],
    about: [
      {
        es: "Con Brane lograr Mejorar tus habilidades y conocimientos para él mercado laboral está a tu alcance, certificándote en nuestros cursos y talleres especializados y en colaboración con Prestigiosas universidades de toda la región.",
        en: "With Brane, improving your skills and knowledge for the labor market is within your reach, certifying you in our specialized courses and workshops and in collaboration with prestigious universities throughout the region.",
      },
    ],
    courses: [
      {
        es: "Descubre nuevas habilidades",
        en: "Discover new skills",
      },
      {
        es: "Diseño",
        en: "Design",
      },
      {
        es: "Desarrollo",
        en: "Development",
      },
    ],
    teach: [
      {
        es: "Vuélvete un instructor",
        en: "Testimonials",
      },
      {
        es: "Profesionales de todo el mundo pueden ser parte de Brane aportando sus conocimientos y habilidades para mejorar la vida profesional millones de personas.",
        en: "Professionals from all over the world can be part of Brane, contributing their knowledge and skills to improve the professional lives of millions of people.",
      },
      {
        es: "Empieza hoy mismo!",
        en: "Get started today!",
      },
      {
        es: "Mejora y desarróllate",
        en: "Improve and develop",
      },
      {
        es: `En Brane podrás desarrollar nuevas habilidades y conocimientos prácticos  para el mercado laboral.\n\nComplementamos tu formación profesional y técnica con habilidades y conocimientos prácticos en las áreas de marketing, negocios y emprendimiento, diseño, ciberseguridad y programación.\n\nTe brindamos el espacio ideal para transformar tu carrera profesional.`,
        en: `At Brane you will be able to develop new skills and practical knowledge for the labor market.\n\nWe complement your professional and technical training with practical skills and knowledge in the areas of marketing, business and entrepreneurship, design, cybersecurity and programming.\n\nWe provide you with the ideal space to transform your professional career.`,
      },
      {
        es: "Quiero registrarme!",
        en: "I want to register!",
      },
    ],
    testimonials: [
      {
        es: "Testimonios",
        en: "Testimonials",
      },
      {
        es: "Brane me ha ayudado a llevar mis cursos a otro nivel. Puedo conocer alumnos de todo el mundo interesados en aumentar sus conocimientos",
        en: "Brane has helped me take my courses to another level. I can meet students from all over the world interested in increasing their knowledge",
      },
      {
        es: "Me encanta esta plataforma, es muy fácil de usar. Sólo cargo mis cursos y ella se encarga de promocionarlos y llevarlos a los alumnos interesados.",
        en: "I love this platform, it is very easy to use. I just upload my courses and she is in charge of promoting them and taking them to interested students.",
      },
      {
        es: "Buscar cursos en Brane es súper fácil. Pero la mejor parte es poder manejar el horario a mi gusto. No pierdo clases y aprendo a mi ritmo.",
        en: "Searching for courses on Brane is super easy. But the best part is being able to manage the schedule to my liking. I don't miss classes and I learn at my own pace.",
      },
    ],
    call: [
      {
        es: "Regístrate hoy",
        en: "Sign up today",
      },
      {
        es: "Prueba Brane sin costo",
        en: "Try Brane for free",
      },
      {
        es: "Crea tu cuenta y descubre todo lo que puedes lograr",
        en: "Create your account and discover everything you can achieve",
      },
    ],
  },
  business: {
    success: {
      es: "¡Éxito, nos comunicaremos con usted cuando revisemos su solicitud!",
      en: "Success, we will contact you when we review your request!",
    },
    banner: [
      {
        es: "Brane Empresas",
        en: "Brane Business",
      },
      {
        es: "Desarrolla el talento de tu equipo de trabajo con las habilidades más importantes que requiere el mercado.",
        en: "Develop the talent of your work team with the most important skills that the market requires.",
      },
      {
        es: "Agenda una cita!",
        en: "Schedule an appointment!",
      },
    ],
    formRegister: [
      {
        es: "Agenda una cita",
        en: "Schedule an appointment",
      },
      {
        es: "Nombre de la empresa",
        en: "Business name",
      },
      {
        es: "Email de negocios",
        en: "Business email",
      },
      {
        es: "Contraseña",
        en: "Password",
      },
      {
        es: "Cargando",
        en: "Loading",
      },
      {
        es: "Enviar",
        en: "Send",
      },
    ],
    what: [
      {
        es: "Capacita a tu equipo según tus necesidades",
        en: "Train your team according to your needs",
      },
      {
        es: "Asigna cursos para desarrollar áreas específicas",
        en: "Assign courses to develop specific areas",
      },
      {
        es: "Seguimiento a su avance y toma de decisiones",
        en: "Monitoring your progress and decision making",
      },
      {
        es: "Recibe soporte personalizado",
        en: "Receive personalized support",
      },
    ],
    courses: [
      {
        es: "Que ofrecemos",
        en: "What we offer",
      },
      {
        es: "Diseño",
        en: "Design",
      },
      {
        es: "Desarrollo",
        en: "Development",
      },
    ],
  },
  teach: {
    banner: [
      {
        es: "Conviértete en instructor",
        en: "Become an instructor",
      },
      {
        es: "Vuélvete parte de la comunidad de instructores y tenga a millones de personas en todo el mundo.",
        en: "Become part of the community of instructors and have millions of people around the world.",
      },
      {
        es: "Más información",
        en: "More information",
      },
    ],
    how: [
      {
        es: "Como empezar",
        en: "How to start",
      },
      {
        es: "Diseña tu curso",
        en: "Design your course",
      },
      {
        es: "Disponer de acceso a una computadora y acceso a internet.",
        en: "Have access to a computer and internet access.",
      },
      {
        es: "Recibirás ayuda para gestionar tus primeros contenidos.",
        en: "You will receive help to manage your first content.",
      },
      {
        es: "Genera ingresos de manera recurrente.",
        en: "Generates income on a recurring basis.",
      },
    ],
    become: [
      {
        es: "Vuélvete un instructor hoy",
        en: "Become an instructor today",
      },
      {
        es: "Se parte de nuestra comunidad de instructores y accede a millones de estudiantes en todo el mundo.",
        en: "Be part of our community of instructors and access millions of students around the world.",
      },
      {
        es: "Cargando",
        en: "Loading",
      },
      {
        es: "Empieza ya!",
        en: "Start now!",
      },
    ],
  },
  login: {
    confirmed: {
      es: "El correo electrónico ha sido verificado exitosamente.",
      en: "The email has been successfully verified.",
    },
    access: {
      es: "Acceso exitoso",
      en: "Successful login",
    },
    post: {
      es: "Post-registro completado",
      en: "Post registration completed",
    },
    google: {
      es: "Continuar con Google",
      en: "Continue with Google",
    },
    done: {
      es: "Éxito!",
      en: "Success!",
    },
    box: [
      {
        es: "Bienvenido",
        en: "Welcome",
      },
      {
        es: "Inicie sesión en su cuenta Brane",
        en: "Log in to your Brane account",
      },
      {
        es: "Has olvidado tu contraseña?",
        en: "Have you forgotten your password?",
      },
      {
        es: "Iniciar sesión",
        en: "Log in",
      },
      {
        es: "No tienes una cuenta?",
        en: "You do not have an account?",
      },
      {
        es: "Regístrate",
        en: "Sign up",
      },
      {
        es: "O",
        en: "OR",
      },
      {
        es: "Continuar con Facebook",
        en: "Continue with Facebook",
      },
      {
        es: "Continuar con Apple",
        en: "Continue with Apple",
      },
      {
        es: "Gracias por registrarte",
        en: "Thanks for registering",
      },
      {
        es: "Ingrese la siguiente información para continuar a la aplicación",
        en: "Please enter the following information to continue to the application",
      },
      {
        es: "Nombre",
        en: "Name",
      },
      {
        es: "Apellido",
        en: "Last name",
      },
      {
        es: "Fecha de nacimiento",
        en: "Birthdate",
      },
      {
        es: "Ocupación",
        en: "Occupation",
      },
      {
        es: "Ubicación",
        en: "Location",
      },
      {
        es: "Continuar",
        en: "Continue",
      },
      {
        es: "Descripción del negocio",
        en: "Business Description",
      },
      {
        es: "Numero de empleados",
        en: "Number of employees",
      },
      {
        es: "Fecha de fundación de la empresa",
        en: "Company founding date",
      },
      {
        es: "Dirección física del negocio",
        en: "Physical address of the business",
      },
      {
        es: "Descripción de la Institución",
        en: "Institution Description",
      },
      {
        es: "Fecha de fundación de la Institución",
        en: "Founding date of the Institution",
      },
      {
        es: "Dirección física de la Institución",
        en: "Physical address of the Institution",
      },
    ],
  },
  signup: [
    {
      es: "Regístrate",
      en: "Sign up",
    },
    {
      es: "¿Ya tienes una cuenta?",
      en: "Do you already have an account?",
    },
    {
      es: "Iniciar sesión",
      en: "Log in",
    },
    {
      es: "Confirmar contraseña",
      en: "Confirm Password",
    },
    {
      es: "Registrarse",
      en: "Sign up",
    },
    {
      es: `Al hacer clic en "Registrarse", usted acepta nuestros`,
      en: `By clicking "Sign Up", you agree to our`,
    },
    {
      es: "términos de servicio",
      en: "terms of service",
    },
    {
      es: "y",
      en: "&",
    },
    {
      es: "políticas de privacidad",
      en: "privacy policies",
    },
    {
      es: "O",
      en: "OR",
    },
    {
      es: "Continuar con Facebook",
      en: "Continue with Facebook",
    },
    {
      es: "Continuar con Apple",
      en: "Continue with Apple",
    },
    {
      es: "Casi listo",
      en: "Almost ready",
    },
    {
      es: "Para comenzar a usar su cuenta, haga clic en el enlace de verificación que le enviamos a su correo electrónico.",
      en: "To start using your account, click the verification link we sent to your email.",
    },
  ],
  insSignup: [
    {
      es: "Nombre de la institución",
      en: "Name of the Institution",
    },
    {
      es: "Su nombre",
      en: "Your name",
    },
    {
      es: "Su posición en la institucion",
      en: "Your position in the institution",
    },
    {
      es: "Su número de teléfono",
      en: "Your phone number",
    },
    {
      es: "Confirmar Contraseña",
      en: "Confirm Password",
    },
    {
      es: `Contactar asesor`,
      en: `Contact advisor`,
    },
    {
      es: `Al hacer clic en "Contactar asesor", usted acepta nuestros`,
      en: `By clicking “Contact advisor”, you agree to our`,
    },
    {
      es: "términos de servicio",
      en: "terms of service",
    },
    {
      es: "y",
      en: "&",
    },
    {
      es: "políticas de privacidad",
      en: "privacy policies",
    },
    {
      es: "Casi listo",
      en: "Almost ready",
    },
    {
      es: "Un asesor se pondrá en contacto contigo para brindar información detallada, así como verificar la existencia de la institución legalmente.",
      en: "An advisor will contact you to provide detailed information, as well as verify the existence of the institution legally.",
    },
  ],
  contact: [
    {
      es: "Contáctanos",
      en: "Contact us",
    },
    {
      es: "Correo electrónico",
      en: "Email",
    },
    {
      es: "Nombre",
      en: "Name",
    },
    {
      es: "Asunto",
      en: "Affair",
    },
    {
      es: "Mensaje",
      en: "Message",
    },
    {
      es: "Enviar",
      en: "Send",
    },
  ],
  recovery: [
    {
      es: "Se ha enviado un enlace de recuperación.",
      en: "A recovery link has been sent.",
    },
    {
      es: "Contraseña cambiada con éxito",
      en: "Password changed successfully",
    },
    {
      es: "Recuperación de Cuenta",
      en: "Account Recovery",
    },
    {
      es: "¿Olvidaste la contraseña de tu cuenta? Ingrese su dirección de correo electrónico y le enviaremos un enlace de recuperación.",
      en: "Forgot your account password? Enter your email address and we will send you a recovery link.",
    },
    {
      es: "Enlace enviado",
      en: "Link sent",
    },
    {
      es: "Recuperar cuenta",
      en: "Recover account",
    },
    {
      es: "Introduzca su nueva contraseña",
      en: "Enter your new password",
    },
    {
      es: "Confirmar contraseña",
      en: "Confirm Password",
    },
    {
      es: "Confirmar",
      en: "Confirm",
    },
  ],
  blog: [
    {
      es: "Artículo de blog",
      en: "Blog article",
    },
    {
      es: "Entradas",
      en: "Entries",
    },
    {
      es: "Leer más",
      en: "Read more",
    },
    {
      es: "Artículo de ayuda",
      en: "Help article",
    },
    {
      es: "Regresar",
      en: "Go back",
    },
    {
      es: "Centro de ayuda",
      en: "Help Center",
    },
  ],
  discoverPage: [
    {
      es: "Catálogo de Cursos",
      en: "Course Catalog",
    },
    {
      es: "¿Necesitas ayuda?",
      en: "Need help?",
    },
    {
      es: "¡Estamos aquí para ayudarte! Visita nuestro centro de ayuda donde aclaramos las dudas más frecuentes de nuestra comunidad",
      en: "We are here to help you! Visit our help center where we clarify the most frequently asked questions of our community",
    },
    {
      es: "Centro de ayuda",
      en: "Help Center",
    },
  ],
  categories: [
    {
      es: "Categorías principales",
      en: "Main categories",
    },
    {
      es: "Categorías",
      en: "Categories",
    },
    {
      es: "Descubre nuevos cursos",
      en: "Discover new courses",
    },
  ],
  spinnerOfDoom: {
    es: "Cargando",
    en: "Loading",
  },
  notificationsPage: [
    {
      es: "Notificaciones",
      en: "Notifications",
    },
    {
      es: "No tienes notificaciones",
      en: "You don't have notifications",
    },
    {
      es: "Ver más",
      en: "See more",
    },
  ],
  cartPage: [
    {
      es: "¡Descuento aplicado!",
      en: "Discount applied!",
    },
    {
      es: "El cupón ingresado no es válido",
      en: "The coupon entered is not valid",
    },
    {
      es: "Mi carrito",
      en: "My cart",
    },
    {
      es: "Seguir comprando",
      en: "Keep buying",
    },
    {
      es: "Ingresa tu cupón aquí",
      en: "Enter your coupon here",
    },
    {
      es: "Consultar cupón",
      en: "Check coupon",
    },
    {
      es: "¿Tiene algún código de descuento?",
      en: "Do you have any discount codes?",
    },
    {
      es: "Para completar la transacción, te enviaremos a los servidores seguros del proveedor de pagos seleccionado.",
      en: "To complete the transaction, we will send you to the secure servers of the selected payment provider.",
    },
    {
      es: "Pagar",
      en: "Pay",
    },
    {
      es: "Créditos",
      en: "Credits",
    },
  ],
  privateBusiness: {
    addUsers: [
      { es: "Usuario creado", en: "User created" },
      { es: "Usuario eliminado", en: "User removed" },
      { es: "Administrar empleados", en: "Manage employees" },
      { es: "Mis empleados", en: "My employees" },
      {
        es: "Usuario sin nombre asignado (Iniciar sesion para cambiar)",
        en: "User without assigned name (Login to change)",
      },
      {
        es: "Aún no tienes usuarios",
        en: "You don't have users yet",
      },
      {
        es: "Agregar empleados",
        en: "Add employees",
      },
      {
        es: "Estudiante",
        en: "Student",
      },
      {
        es: "Añadir",
        en: "Add",
      },
    ],
    faq: [
      { es: "Preguntas frecuentes", en: "Frequently Asked Questions" },
      { es: "Consulta creada", en: "Query created" },
      { es: "Completa todos los campos", en: "Complete all fields" },
      { es: "Cuéntanos tu pregunta", en: "Tell us about your question" },
      { es: "Nombre completo", en: "Full Name" },
      { es: "Número de teléfono", en: "Phone Number" },
      { es: "Cuéntanos tu pregunta aquí", en: "Tell us about your question here" },
      { es: "Enviar pregunta", en: "Send question" },
    ],
    statistics: [
      { es: "Estadísticas", en: "Statistics" },
      { es: "Tasa de progreso de cada curso", en: "Rate of progress of every course" },
      {
        es: "Ninguno de sus empleados ha progresado en ningún curso.",
        en: "None of your employees have progressed in any course.",
      },
      { es: "Todos los empleados", en: "All employees" },
      { es: "ID de usuario", en: "User ID" },
      { es: "Nombre", en: "Name" },
      { es: "ID del curso", en: "Course ID" },
      { es: "Curso", en: "Course" },
      { es: "Progreso", en: "Progress" },
      { es: "Actividad", en: "Activity" },
    ],
  },
  courseCard: [
    { es: "Nuevo", en: "New" },
    { es: "Progreso de finalización", en: "Completion progress" },
    { es: "Tu clasificación", en: "Your rating" },
    { es: "Deja una calificación", en: "Leave a rating" },
    {
      es: "Eres el autor de este curso",
      en: "Eres el autor de este curso",
    },
    {
      es: "Entrar",
      en: "Get in",
    },
  ],
  specialCourseCard: [
    { es: "Administrar descargas", en: "Manage downloads" },
    { es: "Lecciones", en: "Lessons" },
    { es: "El curso no tiene lecciones", en: "The course has no lessons" },
  ],
  lessonDownloader: [
    { es: "La operación no pudo ser completada", en: "The operation could not be completed" },
    { es: "El vídeo se ha almacenado correctamente", en: "The video has been stored successfully" },
    {
      es: "El vídeo se eliminó correctamente de tus descargas.",
      en: "The video was successfully removed from your downloads.",
    },
    {
      es: "Error al eliminar el vídeo de tus descargas",
      en: "Error removing video from your downloads",
    },
    { es: "Tamaño", en: "Size" },
    { es: "Remover datos descargados", en: "Remove downloaded data" },
    { es: "Descargar vídeo", en: "Download video" },
    { es: "No se pudo obtener la lección", en: "Could not get lesson" },
    { es: "Pausar descarga", en: "Pause download" },
    { es: "Progreso de descarga", en: "Download progress" },
  ],
  navigationBars: {
    business: [
      { es: "Catálogo", en: "Catalogue" },
      { es: "Agregar usuarios", en: "Add users" },
      { es: "Estadísticas", en: "Statistics" },
    ],
    institution: [{ es: "Inicio", en: "Start" }],
    instructor: [
      { es: "Crear", en: "Create" },
      { es: "Conferencia", en: "Conference" },
      { es: "Mensajes", en: "Messages" },
      { es: "Cupones", en: "Coupons" },
      { es: "Pagos", en: "Payments" },
    ],
    student: [
      { es: "Descubrir", en: "Discover" },
      { es: "Buscar", en: "Search" },
      { es: "Mis listas", en: "My lists" },
      { es: "Perfil", en: "Profile" },
    ],
  },
  optionsMenu: [
    {
      es: "Tu configuración de notificaciones ha sido actualizada.",
      en: "Your notification settings have been updated.",
    },
    { es: "Ajustes", en: "Settings" },
    { es: "Conviértete en instructor", en: "Become an instructor" },
    { es: "Editar perfil", en: "Edit profile" },
    { es: "Notificaciones de mensajes", en: "Message notifications" },
    { es: "Notificación de promociones", en: "Promotions notification" },
    { es: "Notificaciones de anuncios del instructor", en: "Instructor Announcement Notifications" },
    { es: "Centro de ayuda", en: "Help Center" },
    { es: "Cerrar sesión", en: "Logout" },
  ],
  reportModal: [
    { es: "Reportar problema", en: "Report problem" },
    { es: "Título del problema", en: "Problem title" },
    { es: "Comentarios", en: "Comments" },
    { es: "Cancelar", en: "Cancel" },
    { es: "Enviar", en: "Send" },
  ],
  reviewModal: [
    { es: "Reseña creada", en: "Review created" },
    { es: "Reseña actualizada", en: "Review updated" },
    { es: "Editar calificación", en: "Edit rating" },
    { es: "¿Qué opinas de este curso?", en: "What do you think of this course?" },
    { es: "Tu reseña aquí", en: "Your review here" },
    { es: "Actualizar reseña", en: "Update review" },
    { es: "Enviar reseña", en: "Submit review" },
  ],
  wishlistModal: [
    { es: "Agregado", en: "Added" },
    { es: "Eliminado", en: "Removed" },
    { es: "Lista de deseos creada", en: "Wishlist created" },
    { es: "Guardar en...", en: "Keep in..." },
    { es: "No tienes listas", en: "You don't have lists" },
    { es: "Nombre de la lista", en: "List name" },
    { es: "Agregar nueva lista", en: "Add new list" },
    { es: "Crear lista", en: "Create list" },
    { es: "Guardar", en: "Save" },
  ],
  cartProvider: [
    { es: "El curso ha sido añadido al carrito.", en: "The course has been added to the cart." },
    { es: "El curso ha sido eliminado del carrito.", en: "The course has been removed from the cart." },
  ],
  privateIntitutions: [
    { es: "Ventas", en: "Sales" },
    { es: "Hola", en: "Hello" },
    { es: "Qué bueno verte", en: "Good to see you" },
    { es: "Inscribe instructores", en: "Register instructors" },
    { es: "Genera ventas y reparte las ganancias.", en: "Generate sales and share profits." },
    { es: "Ir ahora", en: "Go now" },
    {
      es: "Distribución de ganancias obtenidas por instructor:",
      en: "Distribution of profits obtained by instructor:",
    },
    { es: "Ninguno de tus instructores ha vendido un curso.", en: "None of your instructors have sold a course." },
    { es: "ID de usuario", en: "User ID" },
    { es: "Cursos", en: "Courses" },
    { es: "Ventas totales", en: "Total Sales" },
    { es: "ID del curso", en: "Course ID" },
    { es: "Nombre del curso", en: "Course Name" },
    { es: "Resumen de ventas de tus instructores:", en: "Sales summary of your instructors:" },
    { es: "Filtrar por curso", en: "Filter by course" },
    { es: "Filtrar por instructor", en: "Filter by instructor" },
  ],
  privateIntitutionsManage: [
    { es: "Usuario creado", en: "User created" },
    { es: "Usuario eliminado", en: "User deleted" },
    { es: "Administrar instructores", en: "Manage instructors" },
    { es: "Mis instructores", en: "My instructors" },
    { es: "Añadir instructores", en: "Add instructors" },
  ],
  privateInstructor: {
    createConference: [
      { es: "La conferencia ahora es pública.", en: "The conference is now public." },
      { es: "La imagen de la conferencia ha sido cargada.", en: "The conference image has been uploaded." },
      { es: "La conferencia ha sido creada.", en: "The conference has been created." },
      {
        es: "El nombre de la conferencia no puede estar vacío y debe tener al menos 3 letras.",
        en: "The conference name cannot be empty and must be at least 3 letters long.",
      },
      { es: "Introduzca una breve descripción.", en: "Enter a brief description." },
      { es: "Introduce una descripción larga.", en: "Enter a long description." },
      { es: "Selecciona un idioma.", en: "Select a language." },
      {
        es: "Debes especificar la duración de la conferencia.",
        en: "You must specify the duration of the conference.",
      },
      { es: "Debes especificar la fecha de la conferencia.", en: "You must specify the date of the conference." },
      { es: "Debes especificar una contraseña.", en: "You must specify a password." },
      {
        es: "Debes especificar qué aprenderás con la conferencia.",
        en: "You must specify what you will learn from the conference.",
      },
      { es: "Debes ingresar al menos 1 requerimiento", en: "You must enter at least 1 requirement" },
      { es: "Debes especificar para quién es la conferencia.", en: "You must specify who the conference is for." },
      { es: "Debes seleccionar una categoría.", en: "You must select a category." },
      {
        es: "El precio de la conferencia no puede ser inferior a 5$",
        en: "The price of the conference cannot be less than $5",
      },
      { es: "Falta una imagen de la conferencia.", en: "An image of the conference is missing." },
      { es: "Lo básico", en: "The basics" },
      { es: "Título de la conferencia", en: "Conference title" },
      { es: "Cómo...", en: "How to..." },
      {
        es: "Elija un título único que lo distinga de otras conferencias",
        en: "Choose a unique title that sets you apart from other conferences",
      },
      { es: "Breve descripción de la conferencia", en: "Brief description of the conference" },
      { es: "Larga historia corta...", en: "Long story short..." },
      {
        es: "Una descripción que describe rápidamente de qué se trata la conferencia.",
        en: "A description that quickly describes what the conference is about.",
      },
      { es: "Descripción de la conferencia", en: "Conference description" },
      { es: "Érase una vez...", en: "Once upon a time..." },
      { es: "Una descripción completa de la conferencia.", en: "A complete description of the conference." },
      { es: "Idioma del curso", en: "Course language" },
      { es: "Español", en: "Spanish" },
      { es: "Portugués", en: "Portuguese" },
      { es: "Inglés", en: "English" },
      { es: "El idioma hablado de su conferencia.", en: "The spoken language of your conference." },
      { es: "Información específica", en: "Specific information" },
      { es: "Duración", en: "Duration" },
      { es: "La duración en minutos de su conferencia.", en: "The duration in minutes of your conference." },
      { es: "Fecha de Inicio", en: "Start date" },
      { es: "La fecha en la que empezará su conferencia.", en: "The date your conference will begin." },
      { es: "Contraseña", en: "Password" },
      {
        es: "La contraseña con la que sus estudiantes podrán acceder a la conferencia.",
        en: "The password with which your students will be able to access the conference.",
      },
      { es: "Lo que vas a aprender", en: "What you are going to learn" },
      { es: "Añadir algo", en: "Add something" },
      { es: "Aprenderás...", en: "You'll learn..." },
      {
        es: "Dígale a su audiencia lo que aprenderán después de completar esta conferencia.",
        en: "Tell your audience what they will learn after completing this lecture.",
      },
      { es: "Agregar", en: "Add" },
      { es: "Requerimientos", en: "Requirements" },
      { es: "Necesitará...", en: "You will need..." },
      {
        es: "Dígale a su audiencia qué experiencia o requisitos necesitan para completar esta conferencia.",
        en: "Tell your audience what experience or requirements they need to complete this conference.",
      },
      { es: "Para quién es este curso", en: "Who is this course for" },
      { es: "Para todos...", en: "For all..." },
      { es: "¿Quién puede utilizar su conferencia?", en: "Who can use your conference?" },
      { es: "Categorías", en: "Categories" },
      {
        es: "Selecciona la categoría que mejor defina el contenido de tu conferencia",
        en: "Select the category that best defines the content of your conference",
      },
      { es: "El precio", en: "The price" },
      { es: "El precio para el público", en: "The price for the public" },
      { es: "Nuestra tarifa de servicio ", en: "Our service fee" },
      { es: "Tus ganancias netas", en: "Your net profits" },
      {
        es: "Sus ganancias netas son las ganancias que obtendrá después de cada venta de esta conferencia",
        en: "Your net profits are the profits you will make after each sale from this conference",
      },
      { es: "Imagen de la conferencia", en: "Conference image" },
      { es: "Añadir imagen", en: "Add image" },
      { es: "Cambiar imagen", en: "Change image" },
      { es: "Guardar cambios", en: "Save Changes" },
      { es: "Subiendo imagen...", en: "Uploading image..." },
      { es: "Guardando...", en: "Saving..." },
      { es: "Guardar", en: "Save" },
      { es: "Cuéntanos sobre tu conferencia", en: "Tell us about your conference" },
      {
        es: "Contraseña invalida. La contraseña debe tener solo letras, números, guion bajo, guion medio o punto. Máximo 10 caracteres",
        en: "Invalid password. The password must contain only letters, numbers, underscore, hyphen, or period. Maximum 10 characters",
      },
    ],
    createCoupons: [
      { es: "Descuento", en: "Discount" },
      { es: "El cupón ha sido actualizado.", en: "The coupon has been updated." },
      { es: "El cupón ha sido creado.", en: "The coupon has been created." },
      { es: "El cupón ha sido eliminado.", en: "The coupon has been removed." },
      { es: "Administrar cupones", en: "Manage coupons" },
      { es: "Mis cupones", en: "My Coupons" },
      { es: "Aún no has creado ningún cupón", en: "You have not created any coupons yet" },
      { es: "Actualizar cupón", en: "Update coupon" },
      { es: "Crear cupón", en: "Create coupon" },
      { es: "El nombre del cupón", en: "The name of the coupon" },
      { es: "El código de cupón", en: "The coupon code" },
      {
        es: "Una descripción que te ayuda a identificar el cupón",
        en: "A description that helps you identify the coupon",
      },
      { es: "El descuento porcentual", en: "The percentage discount" },
      { es: "Cursos agregados al cupón", en: "Courses added to coupon" },
      { es: "Nada agregado", en: "Nothing added" },
      { es: "Mis cursos", en: "My courses" },
      { es: "Salvar", en: "Save" },
    ],
    home: [
      { es: "Hola", en: "Hi" },
      { es: "¡Qué bueno verte!", en: "Good to see you!" },
      { es: "¿Qué curso vamos a crear hoy?", en: "What course are we going to create today?" },
      { es: "Enseña y benefíciate de ello.", en: "Teach and benefit from it." },
      { es: "Crear un nuevo curso", en: "Create a new course" },
      { es: "Creemos que estos recursos te serán útiles", en: "We think these resources will be useful to you." },
      { es: "Cursos", en: "Courses" },
      { es: "Cómo construir tu audiencia", en: "How to build your audience" },
      { es: "¡Cómo lanzar tu primer curso más rápido!", en: "How to launch your first course faster!" },
      { es: "Noticias", en: "News" },
      { es: "Conferencias", en: "Conferences" },
      { es: "Instructores", en: "Instructors" },
    ],
    payment: [
      { es: "Éxito", en: "Success" },
      { es: "Métodos de pago", en: "Payment methods" },
      {
        es: "Al hacer clic en el botón, el correo de PayPal se configurará automáticamente con la misma dirección de correo que tu cuenta de Brane.",
        en: "When you click the button, your PayPal email will automatically be set to the same email address as your Brane account.",
      },
      { es: "Actualmente el correo configurado es:", en: "Currently the configured email is:" },
      { es: "Vinculado", en: "Linked" },
      { es: "Vincular", en: "Link" },
    ],
    messages: [
      { es: "Comentarios", en: "Comments" },
      { es: "Has enviado el comentario.", en: "You have submitted the comment." },
      { es: "Selecciona uno de tus cursos", en: "Select one of your courses" },
      { es: "Sin datos", en: "No data" },
      { es: "Selecciona una lección para ver sus comentarios", en: "Select a lesson to see its comments" },
      { es: "Lección", en: "Lesson" },
      { es: "Comentarios de la lección", en: "Lesson Comments" },
      { es: "Sin comentarios aún", en: "No comments yet" },
      { es: "Deja un comentario", en: "Leave a comment" },
      { es: "Enviando...", en: "Sending..." },
      { es: "Enviado", en: "Sent" },
    ],
    createCoursePage: [
      { es: "Cuéntanos sobre tu curso", en: "Tell us about your course" },
      { es: "Añade lecciones a tu curso", en: "Add lessons to your course" },
    ],
    editCoursePage: [
      { es: "Editar", en: "Edit" },
      { es: "conferencia", en: "conference" },
      { es: "curso", en: "course" },
      { es: "Lecciones", en: "Lessons" },
    ],
    addLessons: [
      { es: "El curso ha sido publicado.", en: "The course has been published." },
      {
        es: "Una de las lecciones del curso no tiene vídeo.",
        en: "One of the lessons in the course does not have a video.",
      },
      { es: "El curso debe tener al menos una lección.", en: "The course must have at least one lesson." },
      { es: "Agregar lecciones", en: "Add lessons" },
      { es: "Lecciones creadas", en: "Created lessons" },
      { es: "Acciones", en: "Actions" },
      { es: "Publicando...", en: "Posting..." },
      { es: "Finalizar y publicar el curso", en: "Finalize and publish the course" },
    ],
    createCourseInfo: [
      { es: "La imagen del curso ha sido cargada.", en: "The course image has been uploaded." },
      { es: "El curso ha sido creado.", en: "The course has been created." },
      {
        es: "El nombre del curso no puede estar vacío y debe tener al menos 3 letras",
        en: "The course name cannot be empty and must be at least 3 letters",
      },
      { es: "Introduzca una breve descripción", en: "Enter a brief description" },
      { es: "Introduce una descripción larga", en: "Enter a long description" },
      { es: "Selecciona un idioma", en: "Select a language" },
      {
        es: "Debes especificar qué aprenderás con el curso",
        en: "You must specify what you will learn with the course",
      },
      { es: "Debes ingresar al menos 1 requerimiento", en: "You must enter at least 1 requirement" },
      { es: "Debes especificar para quién es el curso", en: "You must specify who the course is for" },
      { es: "Debes seleccionar una categoría", en: "You must select a category" },
      { es: "El precio del curso no puede ser inferior a 5$", en: "The price of the course cannot be less than $5" },
      { es: "Falta una imagen del curso", en: "An image of the course is missing" },
      { es: "Lo básico", en: "The basics" },
      { es: "Título del curso", en: "Course Title" },
      { es: "Cómo...", en: "How to..." },
      {
        es: "Elija un título único que lo distinga de otros cursos",
        en: "Choose a unique title that sets you apart from other courses",
      },
      { es: "Breve descripción del curso.", en: "Brief description of the course." },
      { es: "Larga historia corta...", en: "Long story short..." },
      {
        es: "Una descripción que describe rápidamente de qué se trata el curso.",
        en: "A description that quickly describes what the course is about.",
      },
      { es: "Descripción larga del curso", en: "Long course description" },
      { es: "Érase una vez...", en: "Once upon a time..." },
      { es: "Una descripción completa del curso.", en: "A complete course description." },
      { es: "Idioma del curso", en: "Course language" },

      { es: "El idioma hablado de las lecciones de tu curso.", en: "The spoken language of your course lessons." },
      { es: "Certificado", en: "Certificate" },
      { es: "Sí", en: "Yes" },
      {
        es: "¿El curso debería emitir un certificado al finalizar?",
        en: "Should the course issue a certificate upon completion?",
      },
      { es: "Información específica", en: "Specific information" },
      { es: "Lo que vas a aprender", en: "What you are going to learn" },
      { es: "Añadir algo", en: "Add something" },
      { es: "Aprenderás...", en: "You'll learn..." },
      {
        es: "Cuéntale a tu audiencia lo que aprenderán después de completar este curso.",
        en: "Tell your audience what they will learn after completing this course.",
      },
      { es: "Añadir", en: "Add" },
      { es: "Requerimientos", en: "Requirements" },
      { es: "Necesitará...", en: "You will need..." },
      {
        es: "Dile a tu audiencia qué experiencia o requisitos necesitan para completar este curso.",
        en: "Tell your audience what experience or requirements they need to complete this course.",
      },
      { es: "Para quién es este curso", en: "Who is this course for" },
      { es: "Una persona...", en: "A person..." },
      { es: "¿Quién puede utilizar tu curso?", en: "Who can use your course?" },
      { es: "Categorías", en: "Categories" },
      {
        es: "Selecciona la categoría que mejor define el contenido de tu curso",
        en: "Select the category that best defines the content of your course",
      },
      { es: "El precio", en: "The price" },
      { es: "El precio para el público.", en: "The price for the public." },
      { es: "Nuestra tarifa de servicio", en: "Our service fee" },
      { es: "Tus ganancias netas", en: "Your net profits" },
      {
        es: "Tus ganancias netas son las ganancias que obtendrás después de cada venta de este curso.",
        en: "Your net profits are the profits you will make after each sale of this course.",
      },
      { es: "Imagen del curso", en: "Course image" },
      { es: "Añadir imagen", en: "Add image" },
      { es: "Cambiar imagen", en: "Change image" },
      { es: "Salvar cambios", en: "Save changes" },
      { es: "Subiendo archivo...", en: "Uploading file..." },
      { es: "Guardando...", en: "Saving..." },
      { es: "Salvar", en: "Save" },
      { es: "Subtítulos", en: "Subtitles" },
      {
        es: "Sí planeas colocar subtitulos a tus lecciones, selecciona en que idioma",
        en: "If you plan to add subtitles to your lessons, select which language",
      },
    ],
    lessonAggregator: [
      { es: "Se ha subido el vídeo de la lección.", en: "The lesson video has been uploaded." },
      { es: "La lección ha sido creada.", en: "The lesson has been created." },
      {
        es: "El nombre de la lección no puede estar vacío y debe tener al menos 3 letras.",
        en: "The lesson name cannot be empty and must be at least 3 letters long.",
      },
      { es: "Falta descripción en nueva lección", en: "Description missing in new lesson" },
      { es: "Video faltante en nueva lección", en: "Video missing in new lesson" },
      { es: "Nueva lección", en: "New lesson" },
      { es: "Título", en: "Title" },
      { es: "Descripción", en: "Description" },
      { es: "Recursos adicionales", en: "Additional Resources" },
      { es: "Añadir algo", en: "Add something" },
      { es: "Agregar recurso", en: "Add resource" },
      { es: "Agregar recursos adicionales", en: "Add additional resources" },
      { es: "Medios de lección", en: "Lesson Media" },
      { es: "Agregar vídeo", en: "Add video" },
      { es: "Cambiar vídeo", en: "Change video" },
      { es: "Subiendo vídeo...", en: "Uploading video..." },
      { es: "Salvando...", en: "Saving..." },
      { es: "Agregar nueva lección", en: "Add new lesson" },
      { es: "Se han subido los subtitulos de la lección.", en: "The lesson subtitles have been uploaded." },
      { es: "Subtítulos", en: "Subtitles" },
      { es: "Sin subtítulos a agregar", en: "No subtitles to add" },
      { es: "Idioma", en: "Language" },
      { es: "Español", en: "Spanish" },
      { es: "Inglés", en: "English" },
      { es: "Portugués", en: "Portuguese" },
      { es: "Cambiar archivo", en: "Change file" },
      { es: "Seleccionar archivo", en: "Select File" },
      { es: "Agregar subtítulo", en: "Add subtitle" },
      { es: "Subiendo subtítulos", en: "Uploading subtitles" },
      { es: "La información de la lección ha sido actualizada.", en: "Lesson information has been updated." },
      { es: "El nombre de la lección", en: "The name of the lesson" },
      {
        es: "no puede estar vacío y debe tener al menos 3 letras",
        en: "it cannot be empty and must have at least 3 letters",
      },
      { es: "Falta descripción en la lección", en: "Missing description in the lesson" },
      { es: "Falta el video en la lección", en: "Video is missing from the lesson" },
      { es: "Lección", en: "Lesson" },
      { es: "Eliminar lección", en: "Delete lesson" },
      { es: "Actualizar lección", en: "Update lesson" },
      { es: "Reemplazar", en: "Replace" },
      { es: "Borrando...", en: "Deleting..." },
    ],
  },
  advancedSearchPage: [
    { es: "Popular en", en: "Popular in" },
    { es: "Todos los cursos", en: "All courses." },
    { es: "Filtros", en: "Filters" },
    { es: "Estrellas", en: "Stars" },
    { es: "Precio", en: "Price" },
    { es: "No hay resultados", en: "No results" },
  ],
  chat: [
    { es: "Mensaje enviado", en: "Message sent" },
    { es: "¡Chatea con tus instructores!", en: "Chat with your instructors!" },
    { es: "¡Chatea con tus estudiantes!", en: "Chat with your students!" },
    { es: "Buscar usuarios", en: "Search users" },
    { es: "Resultados", en: "Results" },
    { es: "Sin datos", en: "No data" },
    { es: "Mis chats", en: "My chats" },
    { es: "Escriba su mensaje aquí...", en: "Write your message here..." },
  ],
  studentProfile: [
    { es: "Descripción", en: "Description" },
    { es: "Descuento", en: "Discount" },
    { es: "Método de pago", en: "Payment Method" },
    { es: "Fecha", en: "Date" },
    {
      es: "Tu configuración de notificaciones ha sido actualizada.",
      en: "Your notification settings have been updated",
    },
    { es: "Perfil de estudiante", en: "Student profile" },
    { es: "Cambiar avatar", en: "Change avatar" },
    { es: "Edad", en: "Age" },
    { es: "Dirección", en: "Location" },
    { es: "Ocupación", en: "Occupation" },
    { es: "Notificaciones de mensajes", en: "Message notifications" },
    { es: "Notificación de promociones", en: "Promotions notification" },
    { es: "Notificaciones de anuncios del instructor", en: "Instructor Announcement Notifications" },
    { es: "Cursos inscritos", en: "Enrolled Courses" },
    { es: "Cursos completados", en: "Completed courses" },
    { es: "Certificados obtenidos", en: "Obtained Certificates" },
    { es: "Cursos", en: "Courses" },
    { es: "Aún no has comprado cursos", en: "You have not purchased courses yet" },
    { es: "El usuario no ha comprado cursos.", en: "The user has not purchased courses." },
    { es: "Ver más", en: "See more" },
    { es: "Actualmente tienes", en: "You currently have" },
    { es: "créditos", en: "credits" },
    { es: "Sin datos", en: "No data" },
    { es: "Créditos U", en: "U Credits" },
    { es: "Historial de compras", en: "Purchase history" },
  ],
  userProfilePage: [
    { es: "La foto del perfil ha sido actualizada.", en: "The profile photo has been updated." },
    { es: "Perfil de estudiante", en: "Student profile" },
    { es: "Perfil del instructor", en: "Instructor profile" },
    { es: "Perfil de empresa", en: "Business profile" },
    { es: "Perfil de la institución", en: "Institution profile" },
    { es: "Perfil del usuario", en: "User profile" },
    { es: "El usuario", en: "The user" },
    { es: "no existe", en: "does not exist" },
  ],
  instructorProfile: [
    { es: "Descripción", en: "Description" },
    { es: "Descuento", en: "Discount" },
    { es: "Método de pago", en: "Payment Method" },
    { es: "Fecha", en: "Date" },
    {
      es: "Tu configuración de notificaciones ha sido actualizada.",
      en: "Your notification settings have been updated",
    },
    { es: "Perfil de estudiante", en: "Student profile" },
    { es: "Cambiar avatar", en: "Change avatar" },
    { es: "Edad", en: "Age" },
    { es: "Dirección", en: "Location" },
    { es: "Ocupación", en: "Occupation" },
    { es: "Notificaciones de mensajes", en: "Message notifications" },
    { es: "Notificación de promociones", en: "Promotions notification" },
    { es: "Notificaciones de anuncios del instructor", en: "Instructor Announcement Notifications" },
    { es: "Cursos inscritos", en: "Enrolled Courses" },
    { es: "Cursos completados", en: "Completed courses" },
    { es: "Certificados obtenidos", en: "Obtained Certificates" },
    { es: "Cursos", en: "Courses" },
    { es: "Aún no has comprado cursos", en: "You have not purchased courses yet" },
    { es: "El usuario no ha comprado cursos.", en: "The user has not purchased courses." },
    { es: "Ver más", en: "See more" },
    { es: "Actualmente tienes", en: "You currently have" },
    { es: "créditos", en: "credits" },
    { es: "Sin datos", en: "No data" },
    { es: "Créditos U", en: "U Credits" },
    { es: "Historial de compras", en: "Purchase history" },
  ],
};

const DictionaryProvider = ({ children }) => {
  const [language, setLanguage] = useState(getFromLocal("lang") || "es");

  const toggleLanguage = () => {
    if (language === "es") setLanguage("en");
    else setLanguage("es");
  };

  useEffect(() => {
    updateLocal("lang", language);
  }, [language]);

  return (
    <DictionaryContext.Provider value={{ dictionary, language, toggleLanguage }}>{children}</DictionaryContext.Provider>
  );
};

export default DictionaryProvider;
