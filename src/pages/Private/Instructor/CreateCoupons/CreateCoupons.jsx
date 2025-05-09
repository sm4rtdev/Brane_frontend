import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import "./CreateCoupons.scss";

import { AddCircleOutline, CreateOutline, TrashOutline } from "../../../../assets/icons";

import InstructorHeader from "../../../../components/CustomHeaders/InstructorHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import Footer from "../../../../components/Footer/Footer";
import { getCoursesByInstructor } from "../../../../api/getCoursesByInstructor";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";
import { UserDataContext } from "../../../../contexts/UserDataContext";
import { getCreatedCoupons } from "../../../../api/getCreatedCoupons";
import { getCouponBySlug } from "../../../../api/getCouponBySlug";
import { deleteCoupon } from "../../../../api/deleteCoupon";
import { postCoupon } from "../../../../api/postCoupon";
import { putCoupon } from "../../../../api/putCoupon";

const Coupon = ({ id, attributes, handler, erase }) => {
  const { dictionary, language } = useContext(DictionaryContext);

  return (
    <div className="coupon">
      <div className="value">
        <span>{dictionary.privateInstructor.createCoupons[0][language]}:</span>
        <strong>-{attributes.valor}%</strong>
      </div>

      <div className="info">
        <strong>{`${attributes.slug}`}</strong>
        <p>{attributes.descripcion}</p>
      </div>

      <div className="actions">
        <button
          className="small-button"
          onClick={() => {
            handler({ id, slug: attributes.slug });
          }}
        >
          <CreateOutline />
        </button>
        <button
          className="small-button"
          onClick={() => {
            erase(id);
          }}
        >
          <TrashOutline />
        </button>
      </div>
    </div>
  );
};

const CreateCoupons = () => {
  const { dictionary, language } = useContext(DictionaryContext);
  const { userData } = useContext(UserDataContext);

  const [myOwnCourses, setMyOwnCourses] = useState(null);
  const [myOwnCoupons, setMyOwnCoupons] = useState(null);
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
    value: 0,
    courses: [],
    couponCode: "",
  });
  const [selectedExistingCoupon, setSelectedExistingCoupon] = useState(null);
  const [couponInfo, setCouponInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const getMyCoupons = async () => {
    const { ok, data } = await getCreatedCoupons();

    if (ok) {
      setMyOwnCoupons(data.data);
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  useEffect(() => {
    if (selectedExistingCoupon) {
      setCouponInfo(null);

      const getInfo = async () => {
        const { ok, data } = await getCouponBySlug(selectedExistingCoupon.slug);

        if (ok) {
          setCouponInfo(data.data[0]);
          setInputs((c) => {
            return { ...c, couponCode: data.data[0].attributes.slug };
          });
        } else {
          toast.error(`${data.error.message}`);
        }
      };

      getInfo();
    }
  }, [selectedExistingCoupon]);

  useEffect(() => {
    if (couponInfo) {
      let onlyID = couponInfo.attributes.cursos.data.map((item) => item.id);

      setInputs((c) => {
        return {
          ...c,
          name: couponInfo.attributes.nombre,
          description: couponInfo.attributes.descripcion,
          value: couponInfo.attributes.valor,
          courses: onlyID,
        };
      });
    }
  }, [couponInfo]);

  useEffect(() => {
    const getMyOwnCourses = async () => {
      const { ok, data } = await getCoursesByInstructor(userData.info.id);

      if (ok) {
        setMyOwnCourses(data.data);
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    getMyCoupons();
    getMyOwnCourses();
  }, [userData]);

  const isIdInArray = (id) => {
    return inputs.courses.includes(id);
  };

  const deleteFromInputCourses = (id) => {
    const newArray = inputs.courses.filter((number) => number !== id);
    setInputs({ ...inputs, courses: newArray });
  };

  const limitarA100 = (numero) => {
    if (numero > 100) {
      return 100;
    } else {
      return numero;
    }
  };
  const clearEverything = () => {
    setInputs((c) => {
      return {
        ...c,
        name: "",
        description: "",
        value: 0,
        courses: [],
        couponCode: "",
      };
    });
    setSelectedExistingCoupon(null);
    getMyCoupons();
    setCouponInfo(null);
    getMyCoupons();
  };

  const updateCoupon = async (obj) => {
    const { ok, data } = await putCoupon(selectedExistingCoupon.id, obj);

    if (ok) {
      toast.success(dictionary.privateInstructor.createCoupons[1][language]);
      clearEverything();
    } else {
      toast.error(`${data.error.message}`);
    }

    setLoading(false);
  };

  const createCoupon = async (obj) => {
    obj.data.tipo = "porcentaje";

    const { ok, data } = await postCoupon(obj);

    if (ok) {
      toast.success(dictionary.privateInstructor.createCoupons[2][language]);
      clearEverything();
    } else {
      toast.error(`${data.error.message}`);
    }

    setLoading(false);
  };
  const erase = async (id) => {
    const { ok, data } = await deleteCoupon(id);

    if (ok) {
      toast.success(dictionary.privateInstructor.createCoupons[3][language]);
      clearEverything();
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  const handleClick = () => {
    setLoading(true);
    const obj = {
      data: {
        nombre: inputs.name,
        descripcion: inputs.description,
        valor: limitarA100(inputs.value),
        cursos: inputs.courses,
      },
    };

    if (selectedExistingCoupon) {
      updateCoupon(obj);
    } else {
      createCoupon(obj);
    }
  };

  return (
    <div id="create-coupons" className="page">
      <PageTransition margin>
        <InstructorHeader />
        <div className="main">
          <h1>{dictionary.privateInstructor.createCoupons[4][language]}</h1>

          <h2>{dictionary.privateInstructor.createCoupons[5][language]}</h2>

          {myOwnCoupons ? (
            myOwnCoupons.length > 0 ? (
              <div className="my-coupons">
                {myOwnCoupons.map((coupon) => {
                  return <Coupon key={coupon.id} {...coupon} handler={setSelectedExistingCoupon} erase={erase} />;
                })}
              </div>
            ) : (
              <p className="no-data">{dictionary.privateInstructor.createCoupons[6][language]}</p>
            )
          ) : (
            <SpinnerOfDoom standalone />
          )}

          <h2>
            {selectedExistingCoupon
              ? dictionary.privateInstructor.createCoupons[7][language]
              : dictionary.privateInstructor.createCoupons[8][language]}
          </h2>

          {myOwnCourses ? (
            selectedExistingCoupon ? (
              couponInfo ? (
                <div className="edit-coupon-section">
                  <div className="inputs-section">
                    <DynamicInput
                      id={"name"}
                      state={[inputs, setInputs]}
                      noIcon
                      label={dictionary.privateInstructor.createCoupons[9][language]}
                    />
                    <DynamicInput
                      id={"couponCode"}
                      state={[inputs, setInputs]}
                      noIcon
                      label={dictionary.privateInstructor.createCoupons[10][language]}
                      disabled
                    />
                    <DynamicInput
                      id={"description"}
                      state={[inputs, setInputs]}
                      multiline
                      max={50}
                      noIcon
                      label={dictionary.privateInstructor.createCoupons[11][language]}
                    />
                    <DynamicInput
                      id={"value"}
                      type="number"
                      number
                      state={[inputs, setInputs]}
                      noIcon
                      max={100}
                      label={dictionary.privateInstructor.createCoupons[12][language]}
                    />
                  </div>

                  <div className="change-courses">
                    <div className="current">
                      <strong>{dictionary.privateInstructor.createCoupons[13][language]}</strong>
                      {inputs.courses.length > 0 ? (
                        inputs.courses.map((number) => {
                          const obj = myOwnCourses.find((objeto) => objeto.id === number);
                          if (obj) {
                            return (
                              <div key={obj.id} className="option">
                                <strong>{obj.attributes.name}</strong>

                                <button className="small-button" onClick={() => deleteFromInputCourses(obj.id)}>
                                  <TrashOutline />
                                </button>
                              </div>
                            );
                          } else {
                            return null;
                          }
                        })
                      ) : (
                        <p className="no-data">{dictionary.privateInstructor.createCoupons[14][language]}</p>
                      )}
                    </div>

                    <div className="add">
                      <strong>{dictionary.privateInstructor.createCoupons[15][language]}</strong>
                      {myOwnCourses.length > 0 ? (
                        myOwnCourses.map((course) => {
                          if (!isIdInArray(course.id)) {
                            return (
                              <div key={course.id} className="option">
                                <strong>{course.attributes.name}</strong>
                                <button
                                  className="small-button"
                                  onClick={() =>
                                    setInputs((c) => {
                                      if (!c.courses.some((prevNumber) => prevNumber === course.id)) {
                                        const newArray = c.courses.concat(course.id);
                                        return { ...inputs, courses: newArray };
                                      }
                                      return null;
                                    })
                                  }
                                >
                                  <AddCircleOutline />
                                </button>
                              </div>
                            );
                          } else {
                            return null;
                          }
                        })
                      ) : (
                        <p className="no-data">{dictionary.privateInstructor.createCoupons[14][language]}</p>
                      )}
                    </div>
                  </div>

                  <button className="action-button" onClick={handleClick} disabled={loading}>
                    {loading ? (
                      <>
                        <SpinnerOfDoom /> {dictionary.spinnerOfDoom[language]}
                      </>
                    ) : (
                      dictionary.privateInstructor.createCoupons[16][language]
                    )}
                  </button>
                </div>
              ) : (
                <SpinnerOfDoom standalone center />
              )
            ) : (
              <div className="edit-coupon-section">
                <div className="inputs-section">
                  <DynamicInput
                    id={"name"}
                    state={[inputs, setInputs]}
                    noIcon
                    label={dictionary.privateInstructor.createCoupons[9][language]}
                  />
                  <DynamicInput
                    id={"couponCode"}
                    state={[inputs, setInputs]}
                    noIcon
                    label={dictionary.privateInstructor.createCoupons[10][language]}
                    disabled
                  />
                  <DynamicInput
                    id={"description"}
                    state={[inputs, setInputs]}
                    multiline
                    max={50}
                    noIcon
                    label={dictionary.privateInstructor.createCoupons[11][language]}
                  />
                  <DynamicInput
                    id={"value"}
                    type="number"
                    number
                    state={[inputs, setInputs]}
                    noIcon
                    max={100}
                    label={dictionary.privateInstructor.createCoupons[12][language]}
                  />
                </div>

                <div className="change-courses">
                  <div className="current">
                    <strong>{dictionary.privateInstructor.createCoupons[13][language]}</strong>
                    {inputs.courses.length > 0 ? (
                      inputs.courses.map((number) => {
                        const obj = myOwnCourses.find((objeto) => objeto.id === number);
                        if (obj) {
                          return (
                            <div key={obj.id} className="option">
                              <strong>{obj.attributes.name}</strong>

                              <button className="small-button" onClick={() => deleteFromInputCourses(obj.id)}>
                                <TrashOutline />
                              </button>
                            </div>
                          );
                        } else {
                          return null;
                        }
                      })
                    ) : (
                      <p className="no-data">{dictionary.privateInstructor.createCoupons[14][language]}</p>
                    )}
                  </div>

                  <div className="add">
                    <strong>{dictionary.privateInstructor.createCoupons[15][language]}</strong>
                    {myOwnCourses.length > 0 ? (
                      myOwnCourses.map((course) => {
                        if (!isIdInArray(course.id)) {
                          return (
                            <div key={course.id} className="option">
                              <strong>{course.attributes.name}</strong>
                              <button
                                className="small-button"
                                onClick={() =>
                                  setInputs((c) => {
                                    if (!c.courses.some((prevNumber) => prevNumber === course.id)) {
                                      const newArray = c.courses.concat(course.id);
                                      return { ...inputs, courses: newArray };
                                    }
                                    return null;
                                  })
                                }
                              >
                                <AddCircleOutline />
                              </button>
                            </div>
                          );
                        } else {
                          return null;
                        }
                      })
                    ) : (
                      <p className="no-data">{dictionary.privateInstructor.createCoupons[14][language]}</p>
                    )}
                  </div>
                </div>

                <button className="action-button" onClick={handleClick} disabled={loading}>
                  {loading ? (
                    <>
                      <SpinnerOfDoom /> {dictionary.spinnerOfDoom[language]}
                    </>
                  ) : (
                    dictionary.privateInstructor.createCoupons[16][language]
                  )}
                </button>
              </div>
            )
          ) : (
            <SpinnerOfDoom standalone />
          )}
        </div>
        <Footer unique instructor />
      </PageTransition>
    </div>
  );
};

export default CreateCoupons;
