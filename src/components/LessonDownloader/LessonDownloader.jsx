import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { DownloadOutline, Pause, TrashOutline } from "../../assets/icons";

import SpinnerOfDoom from "../SpinnerOfDoom/SpinnerOfDoom";
import { getImageLinkFrom } from "../../helpers/getImageLinkFrom";

import "./LessonDownloader.scss";
import { DictionaryContext } from "../../contexts/DictionaryContext";

const LessonDownloader = ({ attributes, triggerUpdate, updater }) => {
  const { dictionary, language } = useContext(DictionaryContext);

  const [existInDatabase, setExistInDatabase] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoID = attributes.clase.data ? attributes.clase.data.id : 0;
  const controllerRef = useRef(null);

  const consultVideo = () => {
    const request = window.indexedDB.open("brane-storage", 1);

    request.onerror = (event) => {
      console.error(event);
      toast.error(dictionary.lessonDownloader[0][language]);
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
      toast.error(dictionary.lessonDownloader[0][language]);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;

      db.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`);
        toast.error(dictionary.lessonDownloader[0][language]);
        setIsDownloading(false);
      };

      const transaction = db.transaction(["videos"], "readwrite");
      const objectStore = transaction.objectStore("videos");

      // Agregar el video a IndexedDB
      const video = { id: videoID, videoBlob };
      const addRequest = objectStore.add(video);

      addRequest.onsuccess = () => {
        triggerUpdate();
        toast.success(dictionary.lessonDownloader[1][language]);
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

    saveVideo(videoBlob);
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
      toast.error(dictionary.lessonDownloader[0][language]);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;

      db.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`);
        toast.error(dictionary.lessonDownloader[0][language]);
        setIsDownloading(false);
      };

      const transaction = db.transaction(["videos"], "readwrite");
      const objectStore = transaction.objectStore("videos");
      const deleteRequest = objectStore.delete(videoID);

      deleteRequest.onsuccess = function () {
        toast.success(dictionary.lessonDownloader[2][language]);
      };

      deleteRequest.onerror = function () {
        toast.error(dictionary.lessonDownloader[3][language]);
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
          {dictionary.lessonDownloader[4][language]}:{" "}
          <strong>{(attributes.clase.data.attributes.size / 1024).toFixed(2)} MB</strong>
        </p>
      )}
      <div className="options">
        {existInDatabase ? (
          <>
            <div></div>
            <button className="small-button" onClick={removeVideo}>
              <TrashOutline />
              <p>{dictionary.lessonDownloader[5][language]}</p>
            </button>
          </>
        ) : (
          <>
            {isDownloading ? (
              <div className="status">
                <SpinnerOfDoom />
                <p>{`${dictionary.lessonDownloader[9][language]}: ${(progress * 100).toFixed(2)}%`}</p>
              </div>
            ) : (
              <div></div>
            )}
            {!isDownloading ? (
              attributes.clase.data ? (
                <button
                  className="small-button"
                  onClick={() => {
                    downloadVideo(getImageLinkFrom(attributes.clase.data.attributes.url));
                  }}
                >
                  <DownloadOutline />
                  <p>{dictionary.lessonDownloader[6][language]}</p>
                </button>
              ) : (
                <p className="no-data">{dictionary.lessonDownloader[7][language]}</p>
              )
            ) : (
              <button className="small-button" onClick={pauseDownload}>
                <Pause />
                <p>{dictionary.lessonDownloader[8][language]}</p>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LessonDownloader;
