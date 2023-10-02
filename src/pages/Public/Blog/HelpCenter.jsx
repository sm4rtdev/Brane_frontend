import React, { useContext } from "react";
import { useOutlet } from "react-router-dom";

import "./BlogPage.scss";

import PageTransition from "../../../components/PageTransition/PageTransition";
import PublicHeader from "../../../components/PublicHeader/PublicHeader";
import FancyImage from "../../../components/FancyImage/FancyImage";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import BlogCard from "./BlogCard";
import { UserDataContext } from "../../../contexts/UserDataContext";

const articles = Array(6).fill({
  id: 1,
  url: `/help/1`,
  imageURL: "/images/help-banner.png",
  title: "Artículo de ayuda",
  shortDescription:
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
});

const HelpCenter = () => {
  const { userData } = useContext(UserDataContext);
  const outlet = useOutlet();

  return (
    <div id="blog-page" className="page">
      <PageTransition margin>
        {userData.jwt ? <Header /> : <PublicHeader />}

        <div className="main">
          <div className="banner">
            <FancyImage src="/images/help-banner.png" />
            <div className="inner">
              <h1>Centro de ayuda</h1>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Commodi, qui ducimus. Earum nemo voluptatem odio ipsum quam non
                minus molestias eveniet! Error nulla culpa deserunt. Quo libero
                mollitia ipsam itaque.
              </p>
            </div>
          </div>

          {outlet ? (
            <>{outlet}</>
          ) : (
            <>
              <h2>Temas</h2>
              <div className="articles">
                {articles.map((article, index) => {
                  return <BlogCard {...article} key={index} />;
                })}
              </div>
            </>
          )}
        </div>

        <Footer
          unique
          {...(userData.mode === "instructor" && { instructor: true })}
        />
      </PageTransition>
    </div>
  );
};

export default HelpCenter;
