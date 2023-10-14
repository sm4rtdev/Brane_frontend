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
import { DictionaryContext } from "../../../contexts/DictionaryContext";

const BlogPage = () => {
  const { dictionary, language } = useContext(DictionaryContext);

  const { userData } = useContext(UserDataContext);
  const outlet = useOutlet();

  const articles = Array(6).fill({
    id: 1,
    type: "blog",
    url: `/blog/1`,
    imageURL: "/images/blog-banner.png",
    title: dictionary.blog[0][language],
    shortDescription:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  });

  return (
    <div id="blog-page" className="page">
      <PageTransition margin>
        {userData.jwt ? <Header /> : <PublicHeader />}

        <div className="main">
          <div className="banner">
            <FancyImage src="/images/blog-banner.png" />
            <div className="inner">
              <h1>Blog</h1>
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
              <h2>{dictionary.blog[1][language]}</h2>
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

export default BlogPage;
