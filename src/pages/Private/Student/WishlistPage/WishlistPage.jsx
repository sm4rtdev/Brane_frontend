import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "./WishlistPage.scss";

import InternalHeader from "../../../../components/InternalHeader/InternalHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import HeaderToggler from "../../../../components/HeaderToggler/HeaderToggler";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import Wishlist from "../../../../components/Wishlist/Wishlist";
import Footer from "../../../../components/Footer/Footer";
import Wish from "./Wish";
import { postWishlistAddDelete } from "../../../../api/postWishlistAddDelete";
import { getMyWishlistFolders } from "../../../../api/getMyWishlistFolders";
import { getSpecificWishlist } from "../../../../api/getSpecificWishlist";
import { postCreateWishlist } from "../../../../api/postCreateWishlist";
import { UserDataContext } from "../../../../contexts/UserDataContext";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";

const WishlistPage = () => {
  const { userData } = useContext(UserDataContext);
  const { dictionary, language } = useContext(DictionaryContext);
  const { listID } = useParams();

  // Folders View
  const [myFolders, setMyFolders] = useState(null);
  const [isCreationOpen, setIsCreationOpen] = useState(false);
  const [input, setInput] = useState({
    name: "",
  });

  //List view
  const [list, setList] = useState(null);

  const getFolders = async () => {
    const { ok, data } = await getMyWishlistFolders();

    // console.log(data);

    if (ok) {
      setMyFolders(data);
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  const getList = async (id) => {
    const { ok, data } = await getSpecificWishlist(id);

    // console.log(data);

    if (ok) {
      setList(data);
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  useEffect(() => {
    if (listID === undefined) {
      setMyFolders(null);

      getFolders();
    } else {
      setList(null);

      getList(listID);
    }
  }, [listID]);

  const createWishlist = async () => {
    const obj = {
      data: { name: input.name },
    };

    const { ok, data } = await postCreateWishlist(obj);

    // console.log(data);

    if (ok) {
      getFolders();
      setInput({ name: "" });
      setIsCreationOpen(false);
      toast.success(dictionary.wishListPage[0][language]);
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  const addDelete = async (itemID) => {
    const obj = {
      data: { curso: itemID, list_wishlist: list.id },
    };

    const { ok, data } = await postWishlistAddDelete(obj);

    // console.log(data);

    if (ok) {
      getList(listID);
      toast.success(data.message === "borrado" ? dictionary.wishListPage[1][language] : dictionary.wishListPage[2][language]);
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  return (
    <div id="wishlist-page" className="page">
      <PageTransition margin>
        <HeaderToggler>
          <InternalHeader
            options={{
              backButton: true,
              bigTitle: true,
              cart: true,
            }}
            title={
              listID !== undefined && list ? list.name : dictionary.wishListPage[3][language]
            }
          />
        </HeaderToggler>
        <div className="main">
          {listID === undefined ? (
            myFolders ? (
              <>
                <div className="title">
                  <h1>{dictionary.wishListPage[4][language]}</h1>
                </div>

                <div className="add-list-section">
                  {isCreationOpen ? (
                    <>
                      <DynamicInput
                        id={"name"}
                        state={[input, setInput]}
                        label={dictionary.wishListPage[5][language]}
                        noIcon
                      />
                      <button
                        className="action-button"
                        disabled={input.name.length < 3}
                        onClick={createWishlist}
                      >
                        {dictionary.wishListPage[6][language]}
                      </button>
                    </>
                  ) : (
                    <button
                      className="action-button"
                      onClick={() => setIsCreationOpen(true)}
                    >
                      {dictionary.wishListPage[7][language]}
                    </button>
                  )}
                </div>

                {myFolders.length > 0 ? (
                  <div className="grid">
                    {myFolders.map((folder) => {
                      return <Wishlist {...folder} key={folder.id} />;
                    })}
                  </div>
                ) : (
                  <div className="no-info">
                    <p>{dictionary.wishListPage[8][language]}</p>
                  </div>
                )}
              </>
            ) : (
              <SpinnerOfDoom standalone center />
            )
          ) : list ? (
            <>
              <div className="title">
                <h1>{list.name}</h1>
              </div>

              {list.cursos.length > 0 ? (
                <div className="download-section">
                  {list.cursos.map((course) => {
                    console.log(course);
                    return (
                      <Wish
                        addDelete={addDelete}
                        type="related wishlist"
                        {...course}
                        key={course.id}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="no-info">
                  <p>{dictionary.wishListPage[9][language]}</p>

                  <Link className="action-button" to="/">
                    {dictionary.wishListPage[10][language]}
                  </Link>
                </div>
              )}
            </>
          ) : (
            <SpinnerOfDoom standalone center />
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

export default WishlistPage;
