import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./features/auth/authSlice"; // ganti path sesuai folder kamu
import App from "./App";

function AppWrapper() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      dispatch(setUser(user));
      console.log("✅ Redux restored from localStorage:", user);
    }
  }, []);

  return <App />;
}

export default AppWrapper;
