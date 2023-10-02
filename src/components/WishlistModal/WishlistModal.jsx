import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { WishlistModalContext } from "../../contexts/WishlistModalContext";
import { postWishlistAddDelete } from "../../api/postWishlistAddDelete";
import { getMyWishlistFolders } from "../../api/getMyWishlistFolders";
import { postCreateWishlist } from "../../api/postCreateWishlist";

import SpinnerOfDoom from "../SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../DynamicInput/DynamicInput";

import "./WishlistModal.scss";

const WishlistModal = ({ selectedCourseID }) => {
  const { closeModal, closeOnClick } = useContext(WishlistModalContext);

  const [myFolders, setMyFolders] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isCreationOpen, setIsCreationOpen] = useState(false);
  const [input, setInput] = useState({
    name: "",
  });

  const modalContainer = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      modalContainer.current.classList.add("visible");
    }, 0);

    const getMyFolders = async () => {
      const { ok, data } = await getMyWishlistFolders();

      // console.log(data);

      if (ok) {
        setMyFolders(data);
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    getMyFolders();
  }, []);

  const addDelete = async () => {
    const obj = {
      data: { curso: selectedCourseID, list_wishlist: selectedFolder },
    };

    const { ok, data } = await postWishlistAddDelete(obj);

    // console.log(data);

    if (ok) {
      toast.success(data.message === "añadido" ? "Agregado" : "Eliminado");
      closeModal();
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  const createWishlist = async () => {
    const obj = {
      data: { name: input.name },
    };

    const { ok, data } = await postCreateWishlist(obj);

    // console.log(data);

    if (ok) {
      setMyFolders((c) => [...c, data]);
      setInput({ name: "" });
      setIsCreationOpen(false);
      toast.success(`Lista de deseos creada`);
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  return (
    <div
      id="wishlist-modal-container"
      onClick={closeOnClick}
      ref={modalContainer}
    >
      <div className="modal">
        <strong>Guardar en...</strong>

        <div className="container">
          {myFolders ? (
            myFolders.length === 0 ? (
              <p className="no-data">No tienes listas</p>
            ) : (
              <div className="lists-container">
                {myFolders.map((list) => {
                  return (
                    <div className="list" key={list.id}>
                      <input
                        type="radio"
                        name="list"
                        id={"radio-" + list.id}
                        value={list.id}
                        checked={list.id === selectedFolder}
                        onChange={() => setSelectedFolder(list.id)}
                      />
                      <label htmlFor={"radio-" + list.id}>{list.name}</label>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <SpinnerOfDoom standalone />
          )}
        </div>

        {isCreationOpen && (
          <div className="add-list-section">
            <DynamicInput
              id={"name"}
              state={[input, setInput]}
              label="Nombre de la lista"
              noIcon
            />
          </div>
        )}

        <div className="button-group">
          {!isCreationOpen ? (
            <button
              className="action-button"
              onClick={() => setIsCreationOpen(true)}
            >
              Agregar nueva lista
            </button>
          ) : (
            <button
              className="action-button"
              disabled={input.name.length < 3}
              onClick={createWishlist}
            >
              Crear lista
            </button>
          )}
          <button
            className="action-button"
            disabled={selectedFolder === null}
            onClick={addDelete}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistModal;
