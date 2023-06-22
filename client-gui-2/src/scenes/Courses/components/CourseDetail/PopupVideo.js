import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { BiLoaderAlt } from "react-icons/bi";

const PopupVideo = (props) => {
  const { link, modal, setModal } = props;
  const [videoLoading, setVideoLoading] = useState(true);

  const spinner = () => {
    setVideoLoading(!videoLoading);
  };

  const overwriteCss = `
  .video-material {
    font-family: sans-serif;
    text-align: center;
  }
  
  .modal__bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(28, 28, 28, 0.19);
    backdrop-filter: blur(6px);
    opacity: 1;
    animation-timing-function: ease-out;
    animation-duration: 0.3s;
    animation-name: modal-video;
    -webkit-transition: opacity 0.3s ease-out;
    -moz-transition: opacity 0.3s ease-out;
    -ms-transition: opacity 0.3s ease-out;
    -o-transition: opacity 0.3s ease-out;
    transition: opacity 0.3s ease-out;
    z-index: 100;
  }
  
  .modal__align {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .modal__content {
    width: 800px;
    height: 500px;
    box-shadow: 0px 100px 80px rgba(184, 184, 184, 0.07),
      0px 25.8162px 19px 4px rgba(178, 178, 178, 0.0456112),
      0px 7.779px 7.30492px rgba(0, 0, 0, 0.035),
      0px 1.48838px 2.0843px rgba(0, 0, 0, 0.0243888);
    border-radius: 20px;
    background: transparent;
    color: #000;
    margin: 0rem 4rem;
  }
  
  .modal__close {
    background-color: white;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    bottom: 50px;
    width: 32px;
    height: 32px;
    padding: 0;
  }
  
  .modal__video-align {
    display: flex;
    position: relative;
    bottom: 37px;
  }
  
  .modal__video-style {
    border-radius: 20px;
    z-index: 100;
  }
  
  .modal__spinner {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .modal__spinner {
    animation: spin 2s linear infinite;
    font-size: 40px;
    color: #1b6aae;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  @media screen and (max-width: 800px) {
    .modal__content {
      margin: 0rem 1rem;
      width: 100%;
    }
    .modal__video-style {
      width: 100%;
    }
  }
  
  @media screen and (max-width: 499px) {
    .modal__content {
      background: transparent;
      height: auto;
    }
    .modal__video-align {
      bottom: 0px;
    }
    .modal__video-style {
      height: auto;
    }
  }  
`;
  return (
    <div className="video-material">
      {modal ? (
        <section className="modal__bg">
          <div className="modal__align">
            <div className="modal__content" modal={modal}>
              <IoCloseOutline
                className="modal__close"
                arial-label="Close modal"
                onClick={() => setModal(false)}
              />
              <div className="modal__video-align">
                {videoLoading ? (
                  <div className="modal__spinner">
                    <BiLoaderAlt
                      className="modal__spinner-style"
                      fadeIn="none"
                    />
                  </div>
                ) : null}
                <iframe
                  className="modal__video-style"
                  onLoad={spinner}
                  loading="lazy"
                  width="800"
                  height="500"
                  src={link}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      ) : null}
      <style type="text/css">{overwriteCss}</style>
    </div>
  );
};

export default PopupVideo;
