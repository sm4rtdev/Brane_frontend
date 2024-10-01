import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import "./SearchPage.scss";

import {
  ChevronForward,
  PersonOutline,
  Search,
} from "../../../../assets/icons";

import PageTransition from "../../../../components/PageTransition/PageTransition";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import SearchHeader from "../../../../components/SearchHeader/SearchHeader";
import CourseCard from "../../../../components/CourseCard/CourseCard";
import Footer from "../../../../components/Footer/Footer";
import { getInstructorsByName } from "../../../../api/getInstructorsByName";
import { CategoriesContext } from "../../../../contexts/CategoriesContext";
import { getImageLinkFrom } from "../../../../helpers/getImageLinkFrom";
import { getCoursesByName } from "../../../../api/getCoursesByName";
import { getAllInstructors } from "../../../../api/getAllInstructors";
import FancyImage from "../../../../components/FancyImage/FancyImage";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";

const CategoryCard = ({ attributes }) => {
  const { language } = useContext(DictionaryContext);
  return (
    <Link to={`/courses/${attributes.slug}`} className="card category-card">
      <p>{language === 'es' ? attributes.nombre : attributes.descripcion}</p>

      <ChevronForward />
    </Link>
  );
};

const InstructorCard = ({ slug, avatar, nombre, apellidos, headline }) => {
  return (
    <Link to={`/user/${slug}`} className="card instructor-card">
      <div className="profile-picture">
        {avatar ? (
          <FancyImage src={getImageLinkFrom(avatar.formats.thumbnail.url)} />
        ) : (
          <PersonOutline />
        )}
      </div>
      <div className="text">
        <strong>{`${nombre} ${apellidos}`}</strong>
        <span>{headline}</span>
      </div>

      <ChevronForward />
    </Link>
  );
};

const SearchPage = () => {
  const { categories } = useContext(CategoriesContext);
  const { dictionary, language } = useContext(DictionaryContext);

  const [input, setInput] = useState({
    query: "",
  });
  const [parentCategories, setParentCategories] = useState(null);
  const [courses, setCourses] = useState(null);
  const [categoryResults, setCategoryResults] = useState(null);
  const [instructorsByName, setInstructorsByName] = useState(null);
  const [instructors, setInstructors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetResults = () => {
    setCourses(null);
    setCategoryResults(null);
    setInstructorsByName(null);
  };

  const getCoursesAndConferences = async () => {
    setIsLoading(true);

    const { ok, data } = await getCoursesByName(input.query);

    // console.log(data.data);

    if (ok) {
      if (data.data.length > 0) setCourses(data.data.slice(0, 10));
    } else {
      toast.warning(`${data.error.message}`);
    }

    setIsLoading(false);
  };

  const filterCategories = () => {
    const results = categories.filter((category) =>
      category.attributes.nombre
        .toLowerCase()
        .includes(input.query.toLowerCase())
    );

    if (results.length > 0) setCategoryResults(results);
  };

  const getInstructorsByQuery = async () => {
    const { ok, data } = await getInstructorsByName(input.query);

    // console.log(data);

    if (ok) {
      if (data.length > 0) setInstructorsByName(data);
    } else {
      toast.warning(`${data.error.message}`);
    }
  };

  useEffect(() => {
    if (categories) {
      const parents = categories.filter(
        (category) => category.attributes.categoria_padre.data === null
      );

      setParentCategories(parents);
    }
  }, [categories]);

  //Delay search to prevent renders on every change
  useEffect(() => {
    if (input.query !== "") {
      resetResults();

      const timeout = setTimeout(() => {
        getCoursesAndConferences();
        filterCategories();
        getInstructorsByQuery();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [input]); //eslint-disable-line

  useEffect(() => {
    const getInstructors = async () => {
      const { ok, data } = await getAllInstructors();

      console.log(data);

      if (ok) {
        if (data.length > 0) setInstructors(data.slice(0, 4));
      } else {
        toast.warning(`${data.error.message}`);
      }
    };

    getInstructors();
  }, []);

  return (
    <div id="search-page" className="page">
      <PageTransition margin>
        <SearchHeader state={[input, setInput]} general />

        <div className="main">
          {input.query === "" ? (
            <div className="instructions">
              <Search />

              <p>
                {dictionary.searchPage[0][language]}
              </p>
            </div>
          ) : (
            <div className="results">
              <h2>{dictionary.searchPage[1][language]}</h2>

              {categoryResults && (
                <div className="result">
                  <h3>{dictionary.searchPage[2][language]}</h3>

                  <div className="list">
                    {categoryResults.map((category) => {
                      return <CategoryCard key={category.id} {...category} />;
                    })}
                  </div>
                </div>
              )}

              {isLoading && <SpinnerOfDoom standalone center />}

              {courses && (
                <div className="result">
                  <h3>{dictionary.searchPage[3][language]}</h3>

                  <div className="list">
                    {courses.map((course) => {
                      return (
                        <CourseCard
                          key={course.id}
                          {...course}
                          type="related"
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {instructorsByName && (
                <div className="result">
                  <h3>{dictionary.searchPage[4][language]}</h3>

                  <div className="list">
                    {instructorsByName.map((instructor) => {
                      return (
                        <InstructorCard key={instructor.id} {...instructor} />
                      );
                    })}
                  </div>
                </div>
              )}

              {!courses &&
                !categoryResults &&
                !instructorsByName &&
                !isLoading &&
                input.query !== "" && (
                  <p className="no-results">{dictionary.searchPage[5][language]}</p>
                )}
            </div>
          )}

          <div className="grid">
            {parentCategories && (
              <div className="section">
                <h2>{dictionary.searchPage[6][language]}</h2>

                <div className="list">
                  {parentCategories.map((category) => {
                    return <CategoryCard key={category.id} {...category} />;
                  })}
                </div>
              </div>
            )}

            {instructors && (
              <div className="section">
                <h2>{dictionary.searchPage[7][language]}</h2>

                <div className="list">
                  {instructors.map((instructor, index) => {
                    return (
                      <InstructorCard key={instructor.id} {...instructor} />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer unique />
      </PageTransition>
    </div>
  );
};

export default SearchPage;
