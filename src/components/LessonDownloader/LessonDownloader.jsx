import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { DownloadOutline, Pause, TrashOutline } from "../../assets/icons";
import { getImageLinkFrom } from "../../helpers/getImageLinkFrom";
import SpinnerOfDoom from "../SpinnerOfDoom/SpinnerOfDoom";

import "./LessonDownloader.scss";

const LessonDownloader = ({ attributes, triggerUpdate, updater }) => {
  const [existInDatabase, setExistInDatabase] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoID = attributes.clase.data ? attributes.clase.data.id : 0;
  const controllerRef = useRef(null);

  const consultVideo = () => {
    const request = window.indexedDB.open("brane-storage", 1);

    request.onerror = (event) => {
      console.error(event);
      toast.error("La operacion no pudo ser completada");
    };

    request.onsuccess = (event) => {
      const db = event.target.result;

      db.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`);
      };

      const transaction = db.transaction(["videos"], "readonly");
      const objectStore = transaction.objectStore("videos");
      const getRequest = objectStore.get(videoID);

      getRequest.onsuccess = () => {
        const video = getRequest.result;
        if (video) {
          setExistInDatabase(true);
          console.log("The video exists in the database", video);
        } else {
          setExistInDatabase(false);
          console.log("The video does not exist in the database");
        }
      };
      transaction.oncomplete = () => {
        db.close();
      };
    };
  };

  useEffect(() => {
    consultVideo();
  }, [updater]); //eslint-disable-line

  const saveVideo = (videoBlob) => {
    const request = window.indexedDB.open("brane-storage", 1);

    request.onerror = (event) => {
      console.error(event);
      setIsDownloading(false);
      toast.error("La operacion no pudo ser completada");
    };

    request.onsuccess = (event) => {
      const db = event.target.result;

      db.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`);
        toast.error("La operacion no pudo ser completada");
        setIsDownloading(false);
      };

      const transaction = db.transaction(["videos"], "readwrite");
      const objectStore = transaction.objectStore("videos");

      // Agregar el video a IndexedDB
      const video = { id: videoID, videoBlob };
      const addRequest = objectStore.add(video);

      addRequest.onsuccess = () => {
        triggerUpdate();
        toast.success("El vídeo se ha almacenado correctamente.");
      };

      transaction.oncomplete = () => {
        setIsDownloading(false);
        db.close();
      };
    };
  };

  const downloadVideo = async (videoURL) => {
    setIsDownloading(true);

    const controller = new AbortController();
    controllerRef.current = controller;

    const response = await fetch(videoURL, {
      signal: controllerRef.current.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const total = response.headers.get("content-length");
    let downloaded = 0;

    const reader = response.body.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      chunks.push(value);
      downloaded += value.length;

      setProgress(downloaded / total);
    }

    const videoBlob = new Blob(chunks);
    // console.log(videoBlob);

    saveVideo(videoBlob);
    // controllerRef.current = null;
  };

  const pauseDownload = () => {
    controllerRef.current.abort();
    setIsDownloading(false);
  };

  const removeVideo = () => {
    const request = window.indexedDB.open("brane-storage", 1);

    request.onerror = (event) => {
      console.error(event);
      setIsDownloading(false);
      toast.error("La operacion no pudo ser completada");
    };

    request.onsuccess = (event) => {
      const db = event.target.result;

      db.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`);
        toast.error("La operacion no pudo ser completada");
        setIsDownloading(false);
      };

      const transaction = db.transaction(["videos"], "readwrite");
      const objectStore = transaction.objectStore("videos");
      const deleteRequest = objectStore.delete(videoID);

      deleteRequest.onsuccess = function () {
        toast.success(`El vídeo se eliminó correctamente de tus descargas.`);
      };

      deleteRequest.onerror = function () {
        toast.error(`Error al eliminar el vídeo de tus descargas`);
      };

      transaction.oncomplete = function () {
        triggerUpdate();
        db.close();
      };
    };
  };

  return (
    <div className="lesson-downloader">
      <p className="title">{`${attributes.nombre}`}</p>

      {attributes.clase.data && (
        <p className="size">
          Tamaño:{" "}
          <strong>
            {(attributes.clase.data.attributes.size / 1024).toFixed(2)} MB
          </strong>
        </p>
      )}
      <div className="options">
        {existInDatabase ? (
          <>
            <div></div>
            <button className="small-button" onClick={removeVideo}>
              <TrashOutline />
              <p>Quitar del local</p>
            </button>
          </>
        ) : (
          <>
            {isDownloading ? (
              <div className="status">
                <SpinnerOfDoom />
                <p>{`Download progress: ${(progress * 100).toFixed(2)}%`}</p>
              </div>
            ) : (
              <div></div>
            )}
            {!isDownloading ? (
              attributes.clase.data ? (
                <button
                  className="small-button"
                  onClick={() => {
                    downloadVideo(
                      getImageLinkFrom(attributes.clase.data.attributes.url)
                    );
                  }}
                >
                  <DownloadOutline />
                  <p>Descargar video</p>
                </button>
              ) : (
                <p className="no-data">No se pudo obtener la lección</p>
              )
            ) : (
              <button className="small-button" onClick={pauseDownload}>
                <Pause />
                <p>Pausar descarga</p>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LessonDownloader;
