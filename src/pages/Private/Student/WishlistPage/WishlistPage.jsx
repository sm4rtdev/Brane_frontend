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

const WishlistPage = () => {
  const { userData } = useContext(UserDataContext);
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
      toast.success(`Lista de deseos creada`);
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
      toast.success(data.message === "borrado" ? "Removido" : "Añadido");
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
              listID !== undefined ? (list ? list.name : true) : "Wishlist"
            }
          />
        </HeaderToggler>
        <div className="main">
          {listID === undefined ? (
            myFolders ? (
              <>
                <div className="title">
                  <h1>Mis listas</h1>
                </div>

                <div className="add-list-section">
                  {isCreationOpen ? (
                    <>
                      <DynamicInput
                        id={"name"}
                        state={[input, setInput]}
                        label="Nombre de la lista"
                        noIcon
                      />
                      <button
                        className="action-button"
                        disabled={input.name.length < 3}
                        onClick={createWishlist}
                      >
                        Crear lista
                      </button>
                    </>
                  ) : (
                    <button
                      className="action-button"
                      onClick={() => setIsCreationOpen(true)}
                    >
                      Agregar nueva lista
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
                    <p>Actualmente no tienes ninguna lista de deseos creada</p>
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
                  <p>Esta lista está actualmente vacía</p>

                  <Link className="action-button" to="/">
                    Descubre nuevos cursos
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
