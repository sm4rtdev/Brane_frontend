import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CategoriesContext } from "../../contexts/CategoriesContext";
import { UserDataContext } from "../../contexts/UserDataContext";

import "./Categories.scss";
import { DictionaryContext } from "../../contexts/DictionaryContext";

const Categories = ({ search, conference }) => {
  const { dictionary, language } = useContext(DictionaryContext);

  const { userData } = useContext(UserDataContext);
  const { categories } = useContext(CategoriesContext);

  const [parentCategories, setParentCategories] = useState(null);

  useEffect(() => {
    if (categories) {
      const parents = categories.filter((category) => category.attributes.categoria_padre.data === null);

      setParentCategories(parents);
    }
  }, [categories]);

  return (
    <div id={`categories-home`} className={`${search ? "search" : ""}`}>
      <strong>
        {search
          ? dictionary.categories[0][language]
          : userData.company
          ? dictionary.categories[1][language]
          : dictionary.categories[2][language]}
      </strong>

      <div className="buttons">
        {parentCategories &&
          parentCategories.map((category) => {
            return (
              <Link
                to={`/${conference ? "conferences" : "courses"}/${category.attributes.slug}`}
                className="btn-cat"
                key={category.id}
              >
                {language === "es" ? category.attributes.nombre : category.attributes.descripcion}
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default Categories;
