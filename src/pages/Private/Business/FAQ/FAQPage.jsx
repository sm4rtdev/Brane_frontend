import React, { useContext, useState } from "react";
import { toast } from "react-toastify";

import "./FAQPage.scss";

import { FAQImage } from "../../../../assets/images";

import BusinessHeader from "../../../../components/CustomHeaders/BusinessHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import Footer from "../../../../components/Footer/Footer";
import FAQDropdown from "./FAQDropdown";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";
import { postFAQ } from "../../../../api/postFAQ";

const questions = [...Array(6)].map((el, index) => {
  return {
    id: index,
    title: "Lorem Ipsum",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
  };
});

const initial = { email: "", name: "", phone: "", question: "" };

const FAQPage = () => {
  const { dictionary, language } = useContext(DictionaryContext);

  const [inputs, setInputs] = useState(initial);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownListener, setDropdownListener] = useState(null);

  const postQuestion = async () => {
    if (inputs.email !== "" && inputs.name !== "" && inputs.phone !== "" && inputs.question !== "") {
      setIsLoading(true);
      const obj = {
        data: {
          email: inputs.email,
          name: inputs.name,
          phone: inputs.phone,
          question: inputs.question,
        },
      };

      const { ok, data } = await postFAQ(obj);

      if (ok) {
        toast.success(dictionary.privateBusiness.faq[1][language]);
        setInputs(initial);
      } else {
        toast.error(`${data.error.message}`);
      }

      setIsLoading(false);
    } else {
      toast.error(dictionary.privateBusiness.faq[2][language]);
    }
  };

  return (
    <div id="business-faq-page" className="page">
      <PageTransition>
        <BusinessHeader />

        <div className="main">
          <h1>FAQ</h1>

          <div className="container">
            <div className="faq-container">
              <h2>{dictionary.privateBusiness.faq[0][language]}</h2>
              {questions.map((value, index) => {
                return (
                  <FAQDropdown
                    key={index}
                    {...value}
                    setDropdownListener={setDropdownListener}
                    dropdownListener={dropdownListener}
                  />
                );
              })}
            </div>

            <div className="image-container">
              <FAQImage />
            </div>

            <div className="questions">
              <h2>{dictionary.privateBusiness.faq[3][language]}</h2>

              <div className="form">
                <DynamicInput id={"email"} state={[inputs, setInputs]} type="email" noIcon placeholder={"Email"} />
                <DynamicInput
                  id={"name"}
                  state={[inputs, setInputs]}
                  noIcon
                  placeholder={dictionary.privateBusiness.faq[4][language]}
                />
                <DynamicInput
                  id={"phone"}
                  state={[inputs, setInputs]}
                  type="tel"
                  noIcon
                  placeholder={dictionary.privateBusiness.faq[5][language]}
                />
                <DynamicInput
                  id={"question"}
                  state={[inputs, setInputs]}
                  multiline
                  noIcon
                  placeholder={dictionary.privateBusiness.faq[6][language]}
                />

                <button className="action-button" onClick={postQuestion} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <SpinnerOfDoom /> {dictionary.spinnerOfDoom[language]}
                    </>
                  ) : (
                    dictionary.privateBusiness.faq[7][language]
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer unique company />
      </PageTransition>
    </div>
  );
};

export default FAQPage;
