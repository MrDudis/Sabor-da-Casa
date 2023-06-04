import "@/styles/globals.css";
import "@/styles/animations.css";

import ModalProvider from "@/providers/modal/ModalProvider";
import UserProvider from "@/providers/user/UserProvider";
import WebSocketProvider from "@/providers/websocket/WebSocketProvider";

export default function App({ Component, pageProps }) {

  const getLayout = Component.getLayout || ((page) => page);

  const Page = (
    <ModalProvider>
      {getLayout(<Component {...pageProps} />)}
    </ModalProvider>
  );

  if (Component.requiresUser) {
    
    return (
      <UserProvider>
        <WebSocketProvider>
          {Page}
        </WebSocketProvider>
      </UserProvider>
    );

  } else {

    return Page;

  };
  
};