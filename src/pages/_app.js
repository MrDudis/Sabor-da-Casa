import "@/styles/globals.css";
import "@/styles/animations.css";

import UserProvider from "@/components/painel/user/UserProvider";

export default function App({ Component, pageProps }) {

  const getLayout = Component.getLayout || ((page) => page);

  if (Component.requiresUser) {
    
    return (
      <UserProvider>
        {getLayout(<Component {...pageProps} />)}
      </UserProvider>
    );

  } else {

    return getLayout(<Component {...pageProps} />);

  };
  
};