import React, { useRef } from "react";

import { ChevronForward } from "../../../../assets/icons";

import CourseCard from "../../../../components/CourseCard/CourseCard";

const Carousel = ({ group }) => {
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

  return (
    <div className="category">
      <h3>{group[0].attributes.categoria.data.attributes.nombre}</h3>
      <div className="carousel">
        <button className="move-left small-button" onClick={moveLeft}>
          <ChevronForward />
        </button>
        <button className="move-right small-button" onClick={moveRight}>
          <ChevronForward />
        </button>

        <div className="container" ref={element}>
          {group.map((course) => {
            return <CourseCard key={course.id} {...course} type="standard" />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
