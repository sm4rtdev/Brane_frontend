import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import "./MyCoursesPage.scss";

import { AddCircleOutline } from "../../../../assets/icons";

import InstructorHeader from "../../../../components/CustomHeaders/InstructorHeader";
import InternalHeader from "../../../../components/InternalHeader/InternalHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import HeaderToggler from "../../../../components/HeaderToggler/HeaderToggler";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import CourseCard from "../../../../components/CourseCard/CourseCard";
import Tabulation from "../../../../components/Tabulation/Tabulation";
import Footer from "../../../../components/Footer/Footer";
import DownloadManager from "./DownloadManager";
import { getCourseAssignmentStatus } from "../../../../api/getCourseAssignmentStatus";
import { getALLCoursesByInstructor } from "../../../../api/getALLCoursesByInstructor";
import { postDeallocateCourse } from "../../../../api/postDeallocateCourse";
import { UserDataContext } from "../../../../contexts/UserDataContext";
import { postAssignCourse } from "../../../../api/postAssignCourse";
import { getCompanyUsers } from "../../../../api/getCompanyUsers";
import { getMyCourses } from "../../../../api/getMyCourses";

const MyCoursesPage = () => {
  const { userData } = useContext(UserDataContext);

  // ========== Student
  const [studentRawCourses, setStudentRawCourses] = useState(null);
  const [studentCoursesFilteredBySearch, setStudentCoursesFilteredBySearch] = useState(null);

  // ========== Instructor
  const [instructorRawCourses, setInstructorRawCourses] = useState(null);
  const [instructorCoursesFilteredBySearch, setInstructorCoursesFilteredBySearch] = useState(null);
  const [instructorPublishedCourses, setInstructorPublishedCourses] = useState(null);

  // Handle async operations
  const [loading, setLoading] = useState(false);

  // For filtering
  const [input, setInput] = useState({
    query: "",
  });

  // Update raw course data when user mode changes
  useEffect(() => {
    setStudentRawCourses(null);
    setStudentCoursesFilteredBySearch(null);

    setInstructorRawCourses(null);
    setInstructorCoursesFilteredBySearch(null);
    setInstructorPublishedCourses(null);

    // Mode instructor
    if (userData.mode === "instructor") {
      (async () => {
        const { ok, data } = await getALLCoursesByInstructor(userData.info.id);

        if (ok) {
          setInstructorRawCourses(data.data);
          setLoading(false);
        } else {
          toast.error(`${data.error.message}`);
          setLoading(false);
        }
      })();
    }
    // Mode student
    else {
      (async () => {
        const { ok, data } = await getMyCourses();

        if (ok) {
          setStudentRawCourses(data.data);
          setLoading(false);
        } else {
          toast.error(`${data.error.message}`);
          setLoading(false);
        }
      })();
    }
  }, [userData]);

  // Filter student courses
  useEffect(() => {
    if (studentRawCourses) {
      const array = studentRawCourses.filter((course) =>
        course.attributes.curso.data.attributes.name.toLowerCase().includes(input.query.toLowerCase())
      );

      setStudentCoursesFilteredBySearch(array);
    }
  }, [studentRawCourses, input.query]);

  // Filter instructor courses
  useEffect(() => {
    if (instructorRawCourses) {
      const array = instructorRawCourses.filter((course) =>
        course.attributes.name.toLowerCase().includes(input.query.toLowerCase())
      );

      setInstructorCoursesFilteredBySearch(array);
      setInstructorPublishedCourses(array.filter((course) => course.attributes.status === "published"));
    }
  }, [instructorRawCourses, input.query]);

  // ================================== Company only ===============================
  const [myUsers, setMyUsers] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [status, setStatus] = useState(null);

  // Get users of company
  if (userData.company) {
    (async () => {
      const { ok, data } = await getCompanyUsers(userData.info.id);

      if (ok) {
        setMyUsers(data);
      } else {
        toast.error(`${data.error.message}`);
      }
    })();
  }

  const getNameOfSelectedCourse = () => {
    let obj = studentRawCourses.find((course) => course.attributes.curso.data.id === selectedCourse);

    if (obj) {
      return obj.attributes.curso.data.attributes.name;
    } else {
      return "";
    }
  };

  const assignCourse = async (userID) => {
    const obj = {
      data: { curso: selectedCourse, usuario: userID },
    };

    const { ok, data } = await postAssignCourse(obj);

    if (ok) {
      toast.success(`Asignado`);
      getStatus();
    } else {
      toast.error(`${data.error.message}`);
    }
  };
  const removeCourse = async (userID) => {
    const obj = {
      data: { curso: selectedCourse, usuario: userID },
    };

    // console.log(obj);

    const { ok, data } = await postDeallocateCourse(obj);

    if (ok) {
      toast.success(`Removido`);
      getStatus();
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  const getStatus = async () => {
    const { ok, data } = await getCourseAssignmentStatus(selectedCourse);

    // console.log("Status", data);

    if (ok) {
      setStatus(data);
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      setStatus(null);

      getStatus();
    }
  }, [selectedCourse]); //eslint-disable-line

  const encountered = (state, id) => {
    let obj = state.find((objeto) => objeto.id === id);

    if (obj.inCourse) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div id="my-courses-page" className="page">
      <PageTransition {...(!userData.company && { margin: true })}>
        {userData.mode !== "instructor" ? (
          <HeaderToggler>
            <InternalHeader
              options={{
                bigTitle: true,
                titleAlignLeft: true,
                cart: true,
                search: true,
              }}
              title={"Mis cursos"}
              queryState={[input, setInput]}
            />
          </HeaderToggler>
        ) : (
          <InstructorHeader />
        )}

        <div className="main">
          <div className="title">
            <h1>Mis cursos</h1>
          </div>

          <div className="filters">
            <DynamicInput id="query" type="search" state={[input, setInput]} label="Buscar mis cursos" />
          </div>

          <Tabulation
            tabs={
              !userData.company
                ? userData.mode === "instructor"
                  ? ["Publicado", "Editar cursos"]
                  : ["Mis cursos y conferencias", "Descargas"]
                : ["Mis cursos", "Asignar usuarios"]
            }
            options={{ type: "bubble", color: "yellow" }}
          >
            {/* First tab */}
            {userData.mode === "instructor" ? (
              <>
                {/* --------- Instructor */}
                {instructorCoursesFilteredBySearch ? (
                  instructorPublishedCourses && instructorPublishedCourses.length > 0 && !loading ? (
                    <div className="courses">
                      {instructorPublishedCourses.map((course) => {
                        return <CourseCard key={course.id} {...course} type={`standard other`} id={course.id} />;
                      })}
                    </div>
                  ) : (
                    <p className="no-data">
                      {input.query === ""
                        ? "Aún no has publicado ningún curso"
                        : "No se encontraron coincidencias para su búsqueda"}
                    </p>
                  )
                ) : (
                  <SpinnerOfDoom standalone top />
                )}
              </>
            ) : (
              <>
                {/* --------- Student OR company */}
                {studentCoursesFilteredBySearch !== null && !loading ? (
                  studentCoursesFilteredBySearch && studentCoursesFilteredBySearch.length > 0 ? (
                    <div className="courses">
                      {studentCoursesFilteredBySearch.map((course) => {
                        return (
                          <CourseCard
                            key={course.id}
                            {...course}
                            type={`standard  ${userData.company ? "small" : "big"}`}
                            {...(userData.company && {
                              company: setSelectedCourse,
                            })}
                            selectedCourse={selectedCourse}
                            id={course.attributes.curso.data.id}
                            currentUserID={userData.info.id}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <p className="no-data">
                      {input.query === ""
                        ? "Aún no has comprado ningún curso"
                        : "No se encontraron coincidencias para su búsqueda"}
                    </p>
                  )
                ) : (
                  <SpinnerOfDoom standalone top />
                )}
              </>
            )}

            {/* Second tab */}
            {!userData.company ? (
              userData.mode === "instructor" ? (
                <>
                  {/* Instructor */}
                  {instructorCoursesFilteredBySearch ? (
                    instructorCoursesFilteredBySearch.length > 0 ? (
                      <div className="courses">
                        {instructorCoursesFilteredBySearch.map((course) => {
                          return (
                            <CourseCard key={course.id} id={course.id} {...course} type={`standard other`} openEdit />
                          );
                        })}
                      </div>
                    ) : (
                      <p className="no-data">
                        {input.query === ""
                          ? "Aún no has creado ningún curso"
                          : "No se encontraron coincidencias para su búsqueda"}
                      </p>
                    )
                  ) : (
                    <SpinnerOfDoom standalone top />
                  )}
                </>
              ) : (
                <>
                  {/*  Student */}
                  {studentCoursesFilteredBySearch ? (
                    studentCoursesFilteredBySearch.length > 0 ? (
                      studentCoursesFilteredBySearch.filter(
                        (course) => course.attributes.curso.data.attributes.tipo !== "conferencia"
                      ).length > 0 ? (
                        <DownloadManager filteredCourses={studentCoursesFilteredBySearch} />
                      ) : (
                        <p className="no-data">No tienes cursos con lecciones descargables</p>
                      )
                    ) : (
                      <p className="no-data">
                        {input.query === ""
                          ? "Aún no has comprado ningún curso"
                          : "No se encontraron coincidencias para su búsqueda"}
                      </p>
                    )
                  ) : (
                    <SpinnerOfDoom standalone top />
                  )}
                </>
              )
            ) : (
              <>
                {studentCoursesFilteredBySearch ? (
                  studentCoursesFilteredBySearch.length > 0 ? (
                    selectedCourse ? (
                      <div className="company">
                        <h2>Curso seleccionado:</h2>

                        <h3>{getNameOfSelectedCourse()}</h3>

                        <h2>Asignar usuarios</h2>

                        {status && myUsers ? (
                          myUsers.length > 0 ? (
                            <div className="users">
                              {myUsers.map((user) => {
                                return (
                                  <div key={user.id} className={"user-card"}>
                                    <div className="data">
                                      <p>
                                        <span>ID:</span> <strong>{user.id}</strong>
                                      </p>
                                      <p>
                                        <span>Email:</span> <strong>{user.email}</strong>
                                      </p>
                                      {!user.name && !user.apellidos ? (
                                        <p>Sin nombre</p>
                                      ) : (
                                        <p>{`${user.nombre ? user.nombre : ""} ${
                                          user.apellidos ? user.apellidos : ""
                                        }`}</p>
                                      )}
                                    </div>
                                    <div className="action">
                                      <button
                                        className="action-button"
                                        onClick={() => {
                                          if (encountered(status, user.id)) {
                                            removeCourse(user.id);
                                          } else {
                                            assignCourse(user.id);
                                          }
                                        }}
                                      >
                                        <AddCircleOutline /> {encountered(status, user.id) ? "Desasignar" : "Asignar"}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="no-data">Aún no tienes usuarios</p>
                          )
                        ) : (
                          <SpinnerOfDoom standalone center />
                        )}
                      </div>
                    ) : (
                      <p className="no-data">Seleccione un curso primero</p>
                    )
                  ) : (
                    <p className="no-data">
                      {input.query === ""
                        ? "Aún no has comprado ningún curso"
                        : "No se encontraron coincidencias para su búsqueda"}
                    </p>
                  )
                ) : (
                  <SpinnerOfDoom standalone top />
                )}
              </>
            )}
          </Tabulation>
        </div>

        <Footer
          unique
          {...(userData.mode === "instructor" && { instructor: true })}
          {...(userData.company && { company: true })}
        />
      </PageTransition>
    </div>
  );
};

export default MyCoursesPage;
