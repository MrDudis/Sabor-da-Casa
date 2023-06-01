import { useState, useEffect, useRef } from "react";

import ModalContext from "@/providers/modal/ModalContext";

const ModalProvider = ({ children }) => {

    const [modal, showModal] = useState(null);
    const [modalClosing, setModalClosing] = useState(false);

    const modalRef = useRef(null);

    const closeModal = () => {
        setModalClosing(true);

        setTimeout(() => {
            showModal(null);
            setModalClosing(false);
        }, 200);
    };

    useEffect(() => {

        const handleClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            };
        };

        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };

    }, [modal]);

    return (
        <ModalContext.Provider value={{ showModal, closeModal }}>
            {
                modal ? (
                    <div className={`fixed inset-0 w-screen h-screen flex flex-col justify-center items-center ${modalClosing ? "modal-background-fade-out" : "modal-background-fade-in"}`} style={{ zIndex: 9999 }}>
                        <div className={`${modalClosing ? "modal-zoom-out" : "modal-zoom-in"}`} ref={modalRef}>
                            { modal ? modal : null }
                        </div>
                    </div>
                ) : null
            }
            {children}
        </ModalContext.Provider>
    );
};

export default ModalProvider;