import { useEffect, useState, useContext } from "react";

import UserContext from "@/providers/user/UserContext";

import User from "@/models/User";

import * as meLib from "@/lib/me";
import * as authLib from "@/lib/auth";

const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const fetchUser = async () => {

    const response = await meLib.get();

    if (response.status === 200) {
      setUser(new User(response.user));
    } else {
      authLib.logout(document).then(() => { window.location.href = "/login"; });
    };

  };

  useEffect(() => { fetchUser(); }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;