import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CategoriesContext } from "../../contexts/CategoriesContext";
import { UserDataContext } from "../../contexts/UserDataContext";

import "./Categories.scss";

const Categories = ({ search, conference }) => {
  const { userData } = useContext(UserDataContext);
  const { categories } = useContext(CategoriesContext);

  const [parentCategories, setParentCategories] = useState(null);

  useEffect(() => {
    if (categories) {
      const parents = categories.filter(
        (category) => category.attributes.categoria_padre.data === null
      );

      setParentCategories(parents);
    }
  }, [categories]);

  return (
    <div id={`categories-home`} className={`${search ? "search" : ""}`}>
      <strong>
        {search
          ? "Categorías principales"
          : userData.company
          ? "Categorías"
          : "Descubre nuevos cursos"}
      </strong>

      <div className="buttons">
        {parentCategories &&
          parentCategories.map((category) => {
            return (
              <Link
                to={`/${conference ? "conferences" : "courses"}/${
                  category.attributes.slug
                }`}
                className="btn-cat"
                key={category.id}
              >
                {category.attributes.nombre}
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default Categories;
