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
      { es: "Correo electrónico", en: "Email" },
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
    { es: "Cursos", en: "Courses" },
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
    { es: "Correo electrónico", en: "Email" },
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
      {
        es: "La información de la conferencia ha sido actualizada.",
        en: "Conference information has been updated.",
      },
      {
        es: "La información del curso ha sido actualizada.",
        en: "The course information has been updated.",
      },
      {
        es: "La imagen de la conferencia ha sido cargada.",
        en: "The conference image has been loaded.",
      },
      {
        es: "La imagen del curso ha sido cargada.",
        en: "The course image has been loaded.",
      },
      {
        es: "El nombre de la conferencia no puede estar vacío y debe tener al menos 3 letras",
        en: "The conference name cannot be empty and must have at least 3 letters",
      },
      {
        es: "El nombre del curso no puede estar vacío y debe tener al menos 3 letras",
        en: "The course name cannot be empty and must have at least 3 letters",
      },
      {
        es: "Introduzca una breve descripción",
        en: "Enter a brief description",
      },
      {
        es: "Introduce una descripción",
        en: "Enter a description",
      },
      {
        es: "Selecciona un idioma",
        en: "Select a language",
      },
      {
        es: "Debes especificar qué aprenderás con la conferencia",
        en: "You must specify what you will learn from the conference",
      },
      {
        es: "Debes especificar qué aprenderás con el curso",
        en: "You must specify what you will learn with the course",
      },
      {
        es: "Debes ingresar al menos 1 requerimiento",
        en: "You must enter at least 1 requirement",
      },
      {
        es: "Debes especificar para quién es la conferencia.",
        en: "You must specify who the conference is for.",
      },
      {
        es: "Debes especificar para quién es el curso.",
        en: "You must specify who the course is for.",
      },
      {
        es: "Debes seleccionar una categoría",
        en: "You must select a category",
      },
      {
        es: "El precio de la conferencia no puede ser inferior a 5$",
        en: "The price of the conference cannot be less than $5",
      },
      {
        es: "El precio del curso no puede ser inferior a 5$",
        en: "The price of the course cannot be less than $5",
      },
      {
        es: "Falta una imagen",
        en: "Missing image",
      },
      {
        es: "Se ha sido eliminado la conferencia.",
        en: "The conference has been deleted.",
      },
      {
        es: "Se ha sido eliminado el curso.",
        en: "The course has been deleted.",
      },
      {
        es: "Se ha publicado la conferencia.",
        en: "The conference has been published.",
      },
      {
        es: "Se ha publicado el curso.",
        en: "The course has been published.",
      },
      {
        es: "Una de las lecciones del curso no tiene vídeo.",
        en: "One of the lessons in the course does not have a video.",
      },
      {
        es: "El curso debe tener al menos una lección.",
        en: "The course must have at least one lesson.",
      },
      {
        es: "Lo basico",
        en: "The basics",
      },
      {
        es: "Título de la conferencia",
        en: "Title of the conference",
      },
      {
        es: "Título del curso",
        en: "Course Title",
      },
      {
        es: "Cómo...",
        en: "As...",
      },
      {
        es: "Elija un título único que lo distinga de otras conferencias",
        en: "Choose a unique title that sets you apart from other conferences",
      },
      {
        es: "Elija un título único que lo distinga de otros cursos",
        en: "Choose a unique title that sets you apart from other courses",
      },
      {
        es: "Breve descripción de la conferencia",
        en: "Brief description of the conference",
      },
      {
        es: "Breve descripción del curso",
        en: "Brief description of the course",
      },
      {
        es: "Larga historia corta...",
        en: "Long story short...",
      },
      {
        es: "Una descripción que describe rápidamente de qué se trata la conferencia",
        en: "A description that quickly describes what the conference is about",
      },
      {
        es: "Descripción de la conferencia",
        en: "Conference Description",
      },
      {
        es: "Descripción del curso",
        en: "Course Description",
      },
      {
        es: "Érase una vez...",
        en: "Once upon a time...",
      },
      {
        es: "Una descripción completa de la conferencia",
        en: "A complete description of the conference",
      },
      {
        es: "Una descripción completa del curso",
        en: "A complete description of the course",
      },
      {
        es: "Idioma de la conferencia",
        en: "Language of the conference",
      },
      {
        es: "Idioma del curso",
        en: "Course language",
      },
      {
        es: "El idioma hablado de la conferencia",
        en: "The spoken language of the conference",
      },
      {
        es: "El idioma hablado de las lecciones de tu curso",
        en: "The spoken language of your course lessons",
      },
      {
        es: "Certificado",
        en: "Certificate",
      },
      {
        es: "Sí",
        en: "Yes",
      },
      {
        es: "¿El curso debería emitir un certificado al finalizar?",
        en: "Should the course issue a certificate upon completion?",
      },
      {
        es: "Información específica",
        en: "Specific information",
      },
      {
        es: "Lo que vas a aprender",
        en: "What you will learn",
      },
      {
        es: "Añadir algo",
        en: "Add something",
      },
      {
        es: "Cuéntale a tu audiencia lo que aprenderán después de completar esta conferencia",
        en: "Tell your audience what they will learn after completing this lecture",
      },
      {
        es: "Cuéntale a tu audiencia lo que aprenderán después de completar este curso",
        en: "Tell your audience what they will learn after completing this course",
      },
      {
        es: "Añadir",
        en: "Add",
      },
      {
        es: "Requerimientos",
        en: "Requirements",
      },
      {
        es: "Aprenderás...",
        en: "You will learn...",
      },
      {
        es: "Necesitará...",
        en: "You will need...",
      },
      {
        es: "Dile a tu audiencia qué experiencia o requisitos necesitan para completar esta conferencia",
        en: "Tell your audience what experience or requirements they need to complete this conference",
      },
      {
        es: "Dile a tu audiencia qué experiencia o requisitos necesitan para completar este curso",
        en: "Tell your audience what experience or requirements they need to complete this course",
      },
      {
        es: "Para quién es este curso",
        en: "Who is this course for?",
      },
      {
        es: "Una persona...",
        en: "A person...",
      },
      {
        es: "¿Quién puede utilizar tu conferencia?",
        en: "Who can use your conference?",
      },
      {
        es: "¿Quién puede utilizar tu curso?",
        en: "Who can use your course?",
      },
      {
        es: "Categorías",
        en: "Categories",
      },
      {
        es: "Selecciona la categoría que mejor define el contenido de tu conferencia",
        en: "Select the category that best defines the content of your conference",
      },
      {
        es: "Selecciona la categoría que mejor define el contenido de tu curso",
        en: "Select the category that best defines the content of your course",
      },
      {
        es: "El precio",
        en: "The price",
      },
      {
        es: "El precio para el público.",
        en: "The price for the public.",
      },
      {
        es: "Nuestra tarifa de servicio",
        en: "Our service fee",
      },
      {
        es: "Tus ganancias netas",
        en: "Your net earnings",
      },
      {
        es: "Tus ganancias netas son las ganancias que obtendrás después de cada venta de esta conferencia",
        en: "Your net earnings are the profits you will make after each sale from this conference",
      },
      {
        es: "Imagen de la conferencia",
        en: "Image of the conference",
      },
      {
        es: "Imagen del curso",
        en: "Course image",
      },
      {
        es: "Añadir imagen",
        en: "Add image",
      },
      {
        es: "Cambiar imagen",
        en: "Change image",
      },
      {
        es: "Guardar cambios",
        en: "Save changes",
      },
      {
        es: "Subiendo archivo...",
        en: "Uploading file...",
      },
      {
        es: "Salvando...",
        en: "Saving...",
      },
      {
        es: "Guardar",
        en: "Save",
      },
      {
        es: "Comprobando la conferencia...",
        en: "Checking the conference...",
      },
      {
        es: "Comprobando el curso...",
        en: "Checking the course...",
      },
      {
        es: "Publicar",
        en: "Publish",
      },
      {
        es: "Eliminar (Acción No Reversible)",
        en: "Delete (Non-Reversible Action)",
      },
      {
        es: "Eliminando...",
        en: "Deleting...",
      },
      {
        es: "Eliminar",
        en: "Delete",
      },
      {
        es: "Lección eliminada exitosamente",
        en: "Lesson successfully deleted",
      },
      {
        es: "Sin datos",
        en: "No data",
      },
      {
        es: "Añadir otra lección",
        en: "Añadir otra lección",
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
    { es: "Charlar", en: "Chat" },
  ],
  coursePage: [
    { es: "Precio actual", en: "Current price" },
    { es: "Añadir a la cesta", en: "Add to cart" },
    { es: "Comprar ahora", en: "Buy Now" },
    { es: "Añadir a la lista de deseos", en: "Add to wishlist" },
    { es: "Eres el creador de", en: "You are the creator of" },
    { es: "esta conferencia", en: "this conference" },
    { es: "este curso", en: "this course" },
    { es: "Ya tienes", en: "You already have" },
    { es: "Ver mis cursos", en: "See my courses" },
    { es: "Ir a la conferencia", en: "Go to the conference" },
    { es: "Ir al curso", en: "Go to the course" },
    { es: "Estrellas", en: "Stars" },
    { es: "(Sin reseñas)", en: "(No reviews)" },
    { es: "Subtítulos", en: "Subtitles" },
    { es: "Estudiantes", en: "Students" },
    { es: "Detalles", en: "Details" },
    { es: "Contenido", en: "Content" },
    { es: "Lo que vas a aprender", en: "What you will learn" },
    { es: "Requisitos", en: "Requirements" },
    { es: "Descripción", en: "Description" },
    { es: "Para quién es esta conferencia", en: "Who is this conference for" },
    { es: "Resumen", en: "Summary" },
    { es: "Duración estimada", en: "Estimated duration" },
    { es: "Lecciones", en: "Lessons" },
    { es: "Recursos adicionales", en: "Additional Resources" },
    { es: "Editar conferencia", en: "Edit conference" },
    { es: "Editar curso", en: "Edit course" },
    { es: "Esta conferencia ya está en tu carrito", en: "This conference is already in your cart" },
    { es: "Este curso ya está en tu carrito", en: "This course is already in your cart" },
    { es: "Compra esta conferencia para ver su contenido", en: "Buy this conference to see its content" },
    { es: "Compra este curso para ver su contenido", en: "Buy this course to see its content" },
    { es: "Ir al carrito", en: "Go to cart" },
    { es: "Añadir al carrito", en: "Add to cart" },
  ],
  editProfilePage: [
    { es: "Tus datos han sido actualizados exitosamente", en: "Your data has been successfully updated" },
    { es: "Editar perfil", en: "Edit profile" },
    { es: "Información de la empresa", en: "Company information" },
    { es: "Nombre de empresa", en: "Company Name" },
    { es: "Fecha de fundación", en: "Founding date" },
    { es: "Dirección", en: "Address" },
    { es: "Numero de Trabajadores", en: "Number of Workers" },
    { es: "Descripción de la empresa", en: "Company Description" },
    { es: "La descripción será visible en tu perfil.", en: "The description will be visible on your profile." },
    { es: "Actualizars", en: "Updates" },
    { es: "Información de la institución", en: "Institution information" },
    { es: "Nombre de la Institución", en: "Name of the Institution" },
    { es: "Descripción de la Institución", en: "Description of the Institution" },
    { es: "Información del contacto", en: "Contact information" },
    { es: "Número de teléfono", en: "Phone number" },
    { es: "Información del estudiante", en: "Student Information" },
    { es: "Nombre", en: "First Name" },
    { es: "Apellido", en: "Last Name" },
    { es: "Fecha de nacimiento", en: "Date of birth" },
    { es: "España", en: "Spain" },
    { es: "Diseñador", en: "Designer" },
    { es: "Ocupación", en: "Occupation" },
    { es: "Información del instructor", en: "Instructor Information" },
    { es: "Enseñando desde el 99", en: "Teaching since 99" },
    { es: "Titular", en: "Holder" },
    {
      es: "El título aparecerá junto a su nombre en sus cursos y resultados de búsqueda.", 
      en: "The title will appear next to your name in your courses and search results." 
    },
    { es: "Instructor en Brane", en: "Instructor in Brane" },
    { es: "Biografía", en: "Biography" },
    { es: "La Bio será visible en tu perfil.", en: "The Bio will be visible on your profile." },
    { es: "", en: "" },
    { es: "", en: "" },
    { es: "", en: "" },
  ],
  myCoursePage: [
    { es: "Asignado", en: "Assigned" },
    { es: "Removido", en: "Removed" },
    { es: "Mis cursos", en: "My courses" },
    { es: "Buscar mis cursos", en: "Find my courses" },
    { es: "Publicado", en: "Published" },
    { es: "Editar cursos", en: "Edit courses" },
    { es: "Mis cursos y conferencias", en: "My courses and conferences" },
    { es: "Descargas", en: "Downloads" },
    { es: "Asignar usuarios", en: "Assign users" },
    { es: "Aún no has publicado ningún curso", en: "You have not published any courses yet" },
    { es: "No se encontraron coincidencias para su búsqueda", en: "No matches were found for your search" },
    { es: "Aún no has comprado ningún curso", en: "You have not purchased any courses yet" },
    { es: "Aún no has creado ningún curso", en: "You haven't created any courses yet" },
    { es: "No tienes cursos con lecciones descargables", en: "You don't have any courses with downloadable lessons" },
    { es: "Curso seleccionado", en: "Selected course" },
    { es: "Correo electrónico", en: "Email" },
    { es: "Sin nombre", en: "Unnamed" },
    { es: "Desasignar", en: "Unassign" },
    { es: "Asignar", en: "Assign" },
    { es: "Aún no tienes usuarios", en: "You don't have any users yet" },
    { es: "Seleccione un curso primero", en: "Select a course first" },
  ],
  businessProfile: [
    { es: "Perfil de empresa", en: "Company profile" },
    { es: "Cargando", en: "Charging" },
    { es: "Cambiar avatar", en: "Change avatar" },
    { es: "Numero de trabajadores", en: "Number of workers" },
    { es: "Dirección", en: "Address" },
    { es: "Empleados", en: "Employees" },
    { es: "Sin datos", en: "No data" },
  ],
  institutionProfile: [
    { es: "Perfil de institución", en: "Institution profile" },
    { es: "Cargando", en: "Charging" },
    { es: "Cambiar avatar", en: "Change avatar" },
    { es: "Fecha de fundación", en: "Founding date" },
    { es: "Dirección", en: "Address" },
    { es: "Sin datos", en: "No data" },
    { es: "Cursos", en: "Courses" },
    { es: "Instructores", en: "Instructors" },
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
    { es: "Perfil del instructor", en: "Instructor profile" },
    { es: "Cargando", en: "Charging" },
    { es: "Cambiar avatar", en: "Change avatar" },
    { es: "Edad", en: "Age" },
    { es: "Dirección", en: "Address" },
    { es: "Ocupación", en: "Occupation" },
    { es: "Sin datos", en: "No data" },
    { es: "Cursos", en: "Courses" },
    { es: "Estudiantes", en: "Students" },
  ],
  conferencePage : [
    { es: "Detalles de la conferencia", en: "Conference details" },
    { es: "Fecha y hora de inicio", en: "Start date and time" },
    { es: "Duración estimada", en: "Estimated duration" },
    { es: "Tu nombre a mostrar", en: "Your display name" },
    { es: "Participante", en: "Participant" },
    { es: "Entrar a la conferencia", en: "Enter the conference" },
    { es: "Tras hacer clic en el botón se te abrirá una ventana emergente.", en: "After clicking the button, a pop-up window will open." },
    { es: "Esta conferencia no tiene descripción", en: "This conference has no description" },
    { es: "Reseñas", en: "Reviews" },
    { es: "Aún no hay reseñas", en: "There are no reviews yet" },
    { es: "Ver perfil", en: "View profile" },
    { es: "¿Algún problema con la conferencia?", en: "Any problems with the conference?" },
    { es: "Informar de un problema", en: "Report a problem" },
    { es: "Partida...", en: "Leaving..." },
    { es: "Cargando reunión de Zoom...", en: "Loading Zoom Meeting..." },
    { es: "Descripción", en: "Description" },
    { es: "Reseñas", en: "Reviews" },
  ],
  learnPage: [
    { es: "Lección", en: "Lesson" },
    { es: "Este curso no posee clases en este momento.", en: "This course does not have classes at this time." },
  ],
  lessonPage: [
    { es: "La operacion no pudo ser completada", en: "The operation could not be completed" },
    { es: "Lección completada", en: "Lesson completed" },
    { es: "Has enviado el comentario", en: "You have submitted the comment" },
    { es: "Estás viendo un vídeo descargado.", en: "You are watching a downloaded video." },
    { es: "Has completado este curso!", en: "You have completed this course!" },
    { es: "Cargando", en: "Charging" },
    { es: "Descargar certificado", en: "Download certificate" },
    { es: "Leccion previa", en: "Previous lesson" },
    { es: "Marcar lección como completada", en: "Mark lesson as completed" },
    { es: "Siguiente lección", en: "Next lesson" },
    { es: "Esta clase no tiene descripción", en: "This class has no description" },
    { es: "Reseñas", en: "Reviews" },
    { es: "Aún no hay reseñas", en: "There are no reviews yet" },
    { es: "Recursos adicionales", en: "Additional Resources" },
    { es: "Esta clase no tiene material adicional", en: "This class has no additional material" },
    { es: "Ver perfil", en: "View profile" },
    { es: "¿Algún problema con el vídeo?", en: "Any problems with the video?" },
    { es: "Informar de un problema", en: "Report a problem" },
    { es: "Comentarios de la lección", en: "Lesson Comments" },
    { es: "Sin comentarios aún", en: "No comments yet" },
    { es: "Deja un comentario", en: "Leave a comment" },
    { es: "Envío...", en: "Sending..." },
    { es: "Enviar", en: "Send" },
    { es: "¿Algún problema con el vídeo?", en: "Any problems with the video?" },
    { es: "Lecciones del curso", en: "Lessons from the course" },
    { es: "Descripción", en: "Description" },
    { es: "Reseñas", en: "Reviews" },
    { es: "Herramientas de aprendizaje", en: "Learning Tools" },
  ],
  payment: [
    { es: "El pago ha fallado", en: "Payment has failed" },
    { es: "No te preocupes, puedes volver a intentarlo en cualquier momento.", en: "Don't worry, you can try again at any time." },
    { es: "Ir al inicio", en: "Go to the beginning" },
    { es: "Felicidades!", en: "Congratulations!" },
    { es: "Te has matriculado exitosamente en el curso", en: "You have successfully enrolled in the course" },
    { es: "Ver mis cursos", en: "See my courses" },
  ],
  roleSelection: [
    { es: "Selecciona el perfil con el que quieres acceder", en: "Select the profile you want to access with" },
    { es: "Estudiante", en: "Student" },
  ],
  searchPage: [
    { 
      es: "Ingrese el nombre de un curso, categoría, subcategoría o instructor en la barra de búsqueda", 
      en: "Enter the name of a course, category, subcategory, or instructor in the search bar" 
    },
    { es: "Resultados de la búsqueda", en: "Search results" },
    { es: "Categorías", en: "Categories" },
    { es: "Cursos y Conferencias", en: "Courses and Conferences" },
    { es: "Instructores", en: "Instructors" },
    { es: "No hay resultados", en: "No results found" },
    { es: "Buscar por categorías principales", en: "Browse by main categories" },
    { es: "Los mejores instructores", en: "The best instructors" },
  ],
  wishListPage: [
    { es: "Lista de deseos creada", en: "Wishlist created" },
    { es: "Removido", en: "Removed" },
    { es: "Añadido", en: "Added" },
    { es: "Lista de deseos", en: "Wishlist" },
    { es: "Mis listas", en: "My lists" },
    { es: "Nombre de la lista", en: "List name" },
    { es: "Crear lista", en: "Create list" },
    { es: "Agregar nueva lista", en: "Add new list" },
    { es: "Actualmente no tienes ninguna lista de deseos creada", en: "You currently have no wish lists created" },
    { es: "Esta lista está actualmente vacía", en: "This list is currently empty" },
    { es: "Descubre nuevos cursos", en: "Discover new courses" },
  ],
  policy: [
    { es: "Política de privacidad", en: "Privacy Policy" },
    {
      es: `La presente Política de Privacidad establece los términos con que BRANE usa y protege la información que es proporcionada por sus usuarios al momento de utilizar su app. Esta compañía está comprometida con la seguridad de los datos de sus usuarios.`, 
      en: `This Privacy Policy establishes the terms under which BRANE uses and protects the information provided by its users when using its app. This company is committed to the security of its users' data.`
    },
    { es: "INFORMACIÓN DEL SITIO Y GENERALIDADES", en: "SITE INFORMATION AND GENERALITIES" },
    {
      es: `La presente Política de Privacidad se aplica a la utilización de los datos personales de cualquier persona que visite o se registre en la web y/o aplicación de BRANE, provista por BRANE.`, 
      en: `This Privacy Policy applies to the use of personal data of any person who visits or registers on the BRANE website and/or application, provided by BRANE.`
    },
    {
      es: `AL ACCEDER, CONECTARSE, REGISTRARSE O DE CUALQUIER OTRA FORMA UTILIZAR LA WEB Y/O EL APP, EL USUARIO CONFIRMA QUE LEYÓ, ENTENDIÓ, CONSINTIÓ Y ACEPTÓ LOS TÉRMINOS Y CONDICIONES DE ESTA POLÍTICA DE PRIVACIDAD. SI NO ESTÁ DE ACUERDO CON LOS TÉRMINOS DE ESTA POLÍTICA DE PRIVACIDAD, EL USUARIO NO DEBE UTILIZAR LA WEB, APP, PLATAFORMA DE CONTENIDO NI LOS CANALES DE COMUNICACIÓN DE BRANE.`, 
      en: `BY ACCESSING, CONNECTING, REGISTERING OR OTHERWISE USING THE WEBSITE AND/OR THE APP, THE USER CONFIRMS THAT HE/SHE HAS READ, UNDERSTOOD, CONSENT TO AND ACCEPTED THE TERMS AND CONDITIONS OF THIS PRIVACY POLICY. IF THE USER DOES NOT AGREE WITH THE TERMS OF THIS PRIVACY POLICY, THE USER SHOULD NOT USE THE WEBSITE, APP, CONTENT PLATFORM OR BRANE COMMUNICATION CHANNELS.`
    },
    {
      es: `SI NO ESTÁ DE ACUERDO CON LOS TÉRMINOS DE ESTA POLÍTICA DE PRIVACIDAD, EL USUARIO NO DEBE UTILIZAR LA WEB, APP, PLATAFORMA DE CONTENIDO NI LOS CANALES DE COMUNICACIÓN DE BRANE.`, 
      en: `IF YOU DO NOT AGREE WITH THE TERMS OF THIS PRIVACY POLICY, THE USER SHOULD NOT USE THE WEBSITE, APP, CONTENT PLATFORM OR BRANE COMMUNICATION CHANNELS.`
    },
    { es: "RESPONSABLE DE TRATAMIENTO DE SUS DATOS PERSONALES", en: "RESPONSIBLE FOR THE PROCESSING OF YOUR PERSONAL DATA" },
    {
      es: `BRANE es una sociedad responsable del tratamiento de los Datos Personales que el Usuario facilite en la App, o que se recopilen o procesen en la App. En cualquier caso, cualesquiera recopilación, uso e información compartida en relación con sus Datos Personales, el Usuario quedará sujeto a esta Política, sus actualizaciones y la política de cookies complementaria.`, 
      en: `BRANE is a company responsible for the processing of Personal Data that the User provides in the App, or that is collected or processed in the App. In any case, any collection, use and sharing of information in relation to your Personal Data, the User will be subject to this Policy, its updates and the complementary cookie policy.`
    },
    { es: "BASES LEGALES", en: "LEGAL BASIS" },
    {
      es: `BRANE procesa la información personal del Usuario sobre las siguientes bases legales: a) consentimiento libre, expreso e informado de los titulares de datos; b) cumplimiento de todo acuerdo contractual con los titulares de datos; c) cumplimiento de obligaciones legales; d) intereses legítimos autorizados por la LPDP.`, 
      en: `BRANE processes the User's personal information on the following legal bases: a) free, express and informed consent of the data subjects; b) compliance with any contractual agreement with the data subjects; c) compliance with legal obligations; d) legitimate interests authorized by the LPDP.`
    },
    { es: "INFORMACIÓN RECOGIDA", en: "INFORMATION COLLECTED" },
    {
      es: `Nuestra Web y/o App podrá recoger información personal, por ejemplo: Nombre, información de contacto (como su dirección de correo electrónico, teléfono e información demográfica, comportamientos de uso y consumo).`, 
      en: `Our Website and/or App may collect personal information, for example: Name, contact information (such as your email address, telephone number and demographic information, usage and consumption behaviors).`
    },
    { es: "FINALIDAD DE LA INFORMACIÓN RECOGIDA", en: "PURPOSE OF THE INFORMATION COLLECTED" },
    {
      es: `Nuestra Web y/o App emplea la información con el fin de proporcionar el mejor servicio al usuario, particularmente para mantener un registro de usuarios, de pedidos en caso que aplique, gestionar, analizar, desarrollar, personalizar y mejorar la App, nuestros productos y servicios.`, 
      en: `Our Website and/or App uses the information in order to provide the best service to the user, particularly to keep a record of users, orders if applicable, manage, analyze, develop, personalize and improve the App, our products and services.`
    },
    {
      es: `Una cookie es un fichero que es enviado con la finalidad de solicitar permiso para almacenarse en su ordenador. Nuestra app emplea las cookies para poder identificar las páginas que son visitadas y su frecuencia`, 
      en: `A cookie is a file that is sent for the purpose of requesting permission to be stored on your computer. Our app uses cookies to identify the pages that are visited and their frequency.`
    },
    { es: "CON QUIÉN SE COMPARTE TU INFORMACIÓN PERSONAL", en: "WITH WHOM YOUR PERSONAL INFORMATION IS SHARED" },
    {
      es: `BRANE jamás venderá tu información personal sin tu consentimiento. Tampoco revelaremos a terceros tu información personal sin tu consentimiento.`, 
      en: `BRANE will never sell your personal information without your consent. We will also never disclose your personal information to third parties without your consent.`
    },
    { es: "ENLACES A TERCEROS", en: "LINKS TO THIRD PARTIES" },
    {
      es: `Tanto la Web y/o App de BRANE pudieran contener enlaces a otros sitios que pudieran ser de su interés.`, 
      en: `Both the BRANE Website and/or App may contain links to other sites that may be of interest to you.`
    },
    { es: "CONTROL DE SU INFORMACIÓN PERSONAL", en: "CONTROL OF YOUR PERSONAL INFORMATION" },
    {
      es: `En cualquier momento usted puede restringir la recopilación o el uso de la información personal que es proporcionada a nuestra web y/o App. Cada vez que se le solicite rellenar un formulario, como el de alta de usuario, puede marcar o desmarcar la opción de recibir información por correo electrónico.`, 
      en: `At any time you may restrict the collection or use of personal information that is provided to our website and/or App. Each time you are asked to fill out a form, such as the user registration form, you can check or uncheck the option to receive information by email.`
    },
    { es: "CONFIDENCIALIDAD Y SEGURIDAD DE LA INFORMACIÓN", en: "CONFIDENTIALITY AND SECURITY OF INFORMATION" },
    {
      es: `BRANE ha adoptado medidas de seguridad razonables para proteger la información del Usuario e impedir el acceso no autorizado a sus datos o cualquier modificación, divulgación o destrucción no autorizada de los mismos.`, 
      en: `BRANE has adopted reasonable security measures to protect the User's information and prevent unauthorized access to its data or any unauthorized modification, disclosure or destruction thereof.`
    },
    { es: "CONSERVACIÓN DE LA INFORMACIÓN", en: "INFORMATION CONSERVATION" },
    {
      es: `BRANE conservará los datos personales por el tiempo que sea necesario para el cumplimiento de las finalidades por las que fueron recolectados.`, 
      en: `BRANE will retain personal data for as long as necessary to fulfill the purposes for which they were collected.`
    },
    { es: "DERECHOS DEL USUARIO SOBRE LA INFORMACIÓN", en: "USER RIGHTS TO INFORMATION" },
    {
      es: `El Usuario tiene los siguientes derechos con relación a sus datos personales: a) Solicitar el acceso a sus datos; b)Rectificar datos incompletos o inexactos que se relacionen con su persona; c) Solicitar a BRANE que elimine sus datos cuando no haya base legal para que sigan procesando dichos datos; d)Retirar cualquier consentimiento que haya proporcionado para el tratamiento de tus datos personales.`, 
      en: `The User has the following rights in relation to his/her personal data: a) Request access to his/her data; b) Rectify incomplete or inaccurate data relating to him/her; c) Request BRANE to delete his/her data when there is no legal basis for them to continue processing said data; d) Withdraw any consent he/she has provided for the processing of his/her personal data.`
    },
    { es: "MODIFICACIÓN DE LA POLÍTICA DE PRIVACIDAD", en: "MODIFICATION OF THE PRIVACY POLICY" },
    {
      es: `Esta Política está sujeta a cambios y actualizaciones. El Usuario debe revisar la Política regularmente para asegurarse de que está familiarizado con su contenido.`, 
      en: `This Policy is subject to change and updates. The User should review the Policy regularly to ensure that he/she is familiar with its content.`
    },
  ],
  terms: [
    { es: "Términos de servicio", en: "Terms of Service" },
    {
      es: "Bienvenido a Brane, una plataforma de aprendizaje en línea que te ofrece cursos de alta calidad impartidos por expertos en la materia. Al usar nuestros Servicios, aceptas los siguientes términos y condiciones, que rigen nuestra relación contigo en relación con los Servicios. Los presentes Términos y Condiciones de uso (“Condiciones”) regulan el acceso o uso que usted haga, como persona o empresa, desde cualquier país del mundo de aplicaciones, páginas web, contenidos, productos, cursos, talleres, conferencias, diplomados y cualquier otro servicio, (“Los Servicios”) puestos a disposición por Brane LTD y sus subsidiarias, una sociedad de responsabilidad limitada constituida en los Estados Unidos",
      en: "Welcome to Brane, an online learning platform that offers you high-quality courses taught by subject matter experts. By using our Services, you agree to the following terms and conditions, which govern our relationship with you in relation to the Services. These Terms and Conditions of Use (“Terms”) govern your access to or use, as an individual or company, from any country in the world of applications, websites, content, products, courses, workshops, conferences, diplomas and any other services, (“The Services”) made available by Brane LTD and its subsidiaries, a limited liability company incorporated in the United States"
    },
    { es: "Introducción", en: "Introduction" },
    { 
      es: "Brane es una plataforma de aprendizaje en línea que te ofrece cursos de alta calidad impartidos por expertos en la materia. Al usar nuestros Servicios, aceptas los siguientes términos y condiciones, que rigen nuestra relación contigo en relación con los Servicios.", 
      en: "Brane is an online learning platform that provides you with high-quality courses taught by subject matter experts. By using our Services, you agree to the following terms and conditions, which govern our relationship with you in relation to the Services." 
    },
    { es: "Uso de los Servicios", en: "Use of the Services" },
    { 
      es: "Puedes usar nuestros Servicios solo para fines legales y de conformidad con estos Términos. No estás autorizado para utilizar nuestros Servicios si no puedes celebrar contratos vinculantes con Brane, si eres menor de edad o si te han suspendido o prohibido el uso de los Servicios.", 
      en: "You may use our Services only for lawful purposes and in accordance with these Terms. You are not authorized to use our Services if you cannot form binding contracts with Brane, if you are a minor, or if you have been suspended or banned from using the Services." 
    },
    { es: "Contenido y propiedad intelectual", en: "Content and intellectual property" },
    { 
      es: "La plataforma Brane, el contenido de los cursos y todo el material relacionado, incluidos, entre otros, texto, gráficos, imágenes, fotografías, audio, música, videos, software, códigos, títulos, diseños, palabras clave, conceptos y temas, se encuentran protegidos por leyes de derechos de autor, marcas registradas y otras leyes de propiedad intelectual aplicables.", 
      en: "The Brane Platform, the Course Content, and all related materials, including but not limited to text, graphics, images, photographs, audio, music, videos, software, code, titles, designs, keywords, concepts, and themes, are protected by applicable copyright, trademark, and other intellectual property laws." 
    },
    { es: "Política de privacidad", en: "Privacy Policy" },
    { 
      es: "En Brane, nos tomamos muy en serio tu privacidad y nuestra Política de privacidad describe cómo recopilamos, utilizamos y compartimos tus datos personales.", 
      en: "At Brane, we take your privacy seriously and our Privacy Policy describes how we collect, use and share your personal data." 
    },
    { es: "Pago y renovación de cursos", en: "Payment and renewal of courses" },
    { 
      es: "Los cursos, talleres, diplomados o carreras de Brane pueden tener un precio y se pueden adquirir individualmente o como parte de una suscripción. Los precios de los cursos se indican en la plataforma y pueden cambiar en cualquier momento. Al comprar un curso, aceptas pagar el precio indicado en la plataforma.", 
      en: "Brane courses, workshops, diplomas or degrees may be priced and can be purchased individually or as part of a subscription. Course prices are listed on the platform and may change at any time. By purchasing a course, you agree to pay the price listed on the platform." 
    },
    { es: "Cancelación y reembolso de cursos", en: "Cancellation and refund of courses" },
    { 
      es: "En Brane, queremos que estés satisfecho con los cursos que adquieras. Por lo tanto, ofrecemos una política de cancelación y reembolso justa y transparente.", 
      en: "At Brane, we want you to be happy with the courses you purchase. Therefore, we offer a fair and transparent cancellation and refund policy." 
    },
    { es: "Derechos de propiedad intelectual", en: "Intellectual property rights" },
    { 
      es: "Respetamos los derechos de propiedad intelectual de terceros y esperamos que nuestros usuarios y tutores hagan lo mismo. Si crees que tu trabajo ha sido copiado de una manera que constituye una infracción de derechos de autor, comunicate con nosotros legal@brane.com y trataremos de resolver el problema de manera justa y rápida.", 
      en: "We respect the intellectual property rights of others and expect our users and tutors to do the same. If you believe that your work has been copied in a way that constitutes copyright infringement, please contact us at legal@brane.com and we will try to resolve the issue fairly and quickly." 
    },
    { es: "Garantías y exenciones de responsabilidad", en: "Warranties and Disclaimers" },
    { 
      es: "Los cursos, talleres, conferencias y demás servicios se proporcionan \"tal cual\" y sin garantía de ningún tipo, ya sea expresa o implícita. Brane no garantiza que los cursos satisfagan tus necesidades o expectativas y no se hace responsable de ningún daño directo, indirecto, incidental, especial, punitivo o consecuente que surja del uso o la incapacidad de uso de los Servicios.", 
      en: "The courses, workshops, conferences and other services are provided \"as is\" and without warranty of any kind, either express or implied. Brane does not guarantee that the courses will meet your needs or expectations and is not liable for any direct, indirect, incidental, special, punitive or consequential damages arising from the use or inability to use the Services." 
    },
    { es: "Indemnización", en: "Compensation" },
    { 
      es: "Al usar nuestros Servicios, aceptas indemnizar, defender y eximir de responsabilidad a Brane y a sus empleados, representantes y agentes, frente a cualquier reclamación, acción legal, demanda, pérdida, responsabilidad, daño, costo y gasto (incluidos, entre otros, los honorarios razonables de los abogados) que surjan de tu incumplimiento de estos Términos o del uso de los Servicios.", 
      en: "By using our Services, you agree to indemnify, defend and hold harmless Brane and its employees, representatives and agents, from and against any and all claims, causes of action, demands, losses, liabilities, damages, costs and expenses (including, but not limited to, reasonable attorneys' fees) arising from your breach of these Terms or your use of the Services." 
    },
    { es: "Resolución de conflictos", en: "Conflict resolution" },
    { 
      es: "Cualquier conflicto relacionado con estos Términos se resolverá mediante arbitraje de conformidad con las normas de arbitraje.", 
      en: "Any dispute relating to these Terms shall be resolved by arbitration in accordance with the arbitration rules." 
    },
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
