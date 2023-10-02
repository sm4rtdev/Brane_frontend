import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Slider from "@mui/material/Slider";

import "./AdvancedSearchPage.scss";

import { ChevronForward } from "../../../../assets/icons";

import PageTransition from "../../../../components/PageTransition/PageTransition";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import SearchHeader from "../../../../components/SearchHeader/SearchHeader";
import Categories from "../../../../components/Categories/Categories";
import CourseCard from "../../../../components/CourseCard/CourseCard";
import Footer from "../../../../components/Footer/Footer";
import { getCoursesByCategoryAndName } from "../../../../api/getCoursesByCategoryAndName";
import { UserDataContext } from "../../../../contexts/UserDataContext";
import { getConferencesByCategoryAndName } from "../../../../api/getConferencesByCategoryAndName";

const AdvancedSearchPage = ({ conference }) => {
  const { userData } = useContext(UserDataContext);
  const [input, setInput] = useState({
    query: "",
  });

  const [courses, setCourses] = useState(null);
  const [popular, setPopular] = useState(null);
  const [noResults, setNoResults] = useState(false);

  const { category, subcategory } = useParams();

  useEffect(() => {
    setNoResults(false);
    setCourses(null);

    const getCourses = async () => {
      const { ok, data } = await getCoursesByCategoryAndName(
        subcategory ? subcategory : category,
        input.query
      );

      // console.log(data.data);

      if (ok) {
        if (data.data.length > 0) {
          setCourses(data.data);
        } else if (input.query !== "") {
          setCourses(null);
          setNoResults(true);
        } else {
          setNoResults(true);
        }
      } else {
        toast.error(`${data.error.message}`);
      }
    };
    const getConferences = async () => {
      const { ok, data } = await getConferencesByCategoryAndName(
        subcategory ? subcategory : category,
        input.query
      );

      // console.log(data.data);

      if (ok) {
        if (data.data.length > 0) {
          setCourses(data.data);
        } else if (input.query !== "") {
          setCourses(null);
          setNoResults(true);
        } else {
          setNoResults(true);
        }
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    if (conference) {
      getConferences();
    } else {
      getCourses();
    }

    //eslint-disable-next-line
  }, [category, subcategory, input]);

  useEffect(() => {
    if (courses) {
      let sorted = courses
        .slice()
        .sort(
          (a, b) =>
            b.attributes.cantidadEstudiantes - a.attributes.cantidadEstudiantes
        );

      setPopular(sorted.slice(0, 10));
    }
  }, [courses]);

  const element = useRef(null);

  const moveLeft = () => {
    if (element.current) {
      element.current.scrollBy({
        top: 0,
        left: -272,
        behavior: "smooth",
      });
    }
  };
  const moveRight = () => {
    if (element.current) {
      element.current.scrollBy({
        top: 0,
        left: 272,
        behavior: "smooth",
      });
    }
  };

  const marks = [
    {
      value: 0,
      label: "0",
    },
    {
      value: 1,
      label: "1",
    },
    {
      value: 2,
      label: "2",
    },
    {
      value: 3,
      label: "3",
    },
    {
      value: 4,
      label: "4",
    },
    {
      value: 5,
      label: "5",
    },
  ];

  const marksPrice = [
    {
      value: 0,
      label: "$0",
    },
    {
      value: 100,
      label: "$100",
    },
    {
      value: 200,
      label: "$200",
    },
    {
      value: 300,
      label: "$300",
    },
  ];

  const [starRange, setStarRange] = useState([0, 5]);

  const handleStarRangeChange = (event, newValue, activeThumb) => {
    const minDistance = 0.5;

    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setStarRange([
        Math.min(newValue[0], starRange[1] - minDistance),
        starRange[1],
      ]);
    } else {
      setStarRange([
        starRange[0],
        Math.max(newValue[1], starRange[0] + minDistance),
      ]);
    }
  };

  const [priceRange, setPriceRange] = useState([0, 300]);

  const handlePriceRangeChange = (event, newValue, activeThumb) => {
    const minDistance = 1;

    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setPriceRange([
        Math.min(newValue[0], priceRange[1] - minDistance),
        priceRange[1],
      ]);
    } else {
      setPriceRange([
        priceRange[0],
        Math.max(newValue[1], priceRange[0] + minDistance),
      ]);
    }
  };

  const [filteredCourses, setFilteredCourses] = useState(null);

  useEffect(() => {
    if (courses) {
      let filteredByStars = courses
        .slice()
        .filter(
          (el) =>
            el.attributes.averageScore >= starRange[0] &&
            el.attributes.averageScore <= starRange[1]
        );

      let filteredByPrice = filteredByStars
        .slice()
        .filter(
          (el) =>
            el.attributes.precio >= priceRange[0] &&
            el.attributes.precio <= priceRange[1]
        );

      setFilteredCourses(filteredByPrice);
    }
  }, [courses, priceRange, starRange]);

  return (
    <div id="advanced-search-page" className="page">
      <PageTransition {...(!userData.company && { margin: true })}>
        <SearchHeader
          state={[input, setInput]}
          starRange={{
            value: starRange,
            handle: handleStarRangeChange,
            marks,
          }}
          priceRange={{
            value: priceRange,
            handle: handlePriceRangeChange,
            marks: marksPrice,
          }}
        />

        <div className="main">
          <Categories search conference={conference} />

          {courses ? (
            <>
              <div className="popular">
                <h2>
                  Popular en:{" "}
                  {courses[0].attributes.categoria.data.attributes.nombre}
                </h2>

                <div className="carousel">
                  <button className="move-left small-button" onClick={moveLeft}>
                    <ChevronForward />
                  </button>
                  <button
                    className="move-right small-button"
                    onClick={moveRight}
                  >
                    <ChevronForward />
                  </button>

                  <div className="container" ref={element}>
                    {popular &&
                      popular.map((course) => {
                        return (
                          <CourseCard
                            key={course.id}
                            {...course}
                            type="standard"
                          />
                        );
                      })}
                  </div>
                </div>
              </div>

              <h2>
                Todos los cursos:{" "}
                {courses[0].attributes.categoria.data.attributes.nombre}
              </h2>

              <div className="filterable">
                <div className="filter">
                  <h2>Filtros</h2>

                  <h3>Estrellas</h3>
                  <div className="slider">
                    <Slider
                      value={starRange}
                      onChange={handleStarRangeChange}
                      valueLabelDisplay="auto"
                      aria-labelledby="range-slider"
                      marks={marks}
                      disableSwap
                      step={0.5}
                      min={0}
                      max={5}
                      sx={{
                        color: "#ffb200",
                        "& .MuiSlider-thumb::before": {
                          boxShadow: "none",
                        },
                      }}
                    />
                  </div>
                  <h3>Precio</h3>
                  <div className="slider">
                    <Slider
                      value={priceRange}
                      onChange={handlePriceRangeChange}
                      valueLabelDisplay="auto"
                      aria-labelledby="range-slider"
                      disableSwap
                      marks={marksPrice}
                      step={1}
                      min={0}
                      max={300}
                      sx={{
                        color: "#ffb200",
                        "& .MuiSlider-thumb::before": {
                          boxShadow: "none",
                        },
                      }}
                    />
                  </div>
                  {/* <h3>Language</h3> */}
                </div>
                <div className="list">
                  {filteredCourses && filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => {
                      return (
                        <CourseCard
                          key={course.id}
                          {...course}
                          type="related"
                        />
                      );
                    })
                  ) : (
                    <p className="no-data">No hay resultados</p>
                  )}
                </div>
              </div>
            </>
          ) : noResults ? (
            <p className="no-results">No hay resultados</p>
          ) : (
            <SpinnerOfDoom standalone center />
          )}
        </div>

        <Footer unique {...(userData.company && { company: true })} />
      </PageTransition>
    </div>
  );
};

export default AdvancedSearchPage;
