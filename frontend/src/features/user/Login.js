import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import LandingIntro from './LandingIntro';
import ErrorText from '../../components/Typography/ErrorText';
import InputText from '../../components/Input/InputText';
import { setUser } from '../auth/authSlice';

function Login() {
  const INITIAL_LOGIN_OBJ = {
    email: "",
    password: ""
  };

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginObj.email,
          password: loginObj.password
        })
      });

      const data = await response.json();

      console.log("LOGIN RESPONSE DATA:", data);

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Cek apakah data.user tersedia dan punya id_user
      if (!data.user || !data.user.id_user) {
        throw new Error("User data incomplete or id_user missing.");
      }

      // Simpan ke localStorage
      localStorage.setItem("token", data.personal_token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Dispatch user info to redux store
      dispatch(setUser({ ...data.user, role: data.role }));

      console.log("User role for redirect:", data.role);

      // Redirect sesuai role
      if (data.role === "bengkel") {
        window.location.href = "/app/dashboard";
      } else if (data.role === "supplier") {
        window.location.href = "/app/dashboard-supplier";
      } else {
        throw new Error("Unknown role.");
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-5xl shadow-xl">
        <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
          <div>
            <LandingIntro />
          </div>
          <div className="py-24 px-10">
            <h2 className="text-2xl font-bold mb-2 text-center">Login</h2>
            <form onSubmit={submitForm}>
              <div className="mb-4">
                <InputText
                  type="email"
                  defaultValue={loginObj.email}
                  updateType="email"
                  containerStyle="mt-4"
                  labelTitle="Email"
                  updateFormValue={updateFormValue}
                />

                <InputText
                  type="password"
                  defaultValue={loginObj.password}
                  updateType="password"
                  containerStyle="mt-4"
                  labelTitle="Password"
                  updateFormValue={updateFormValue}
                />
              </div>

              <div className="text-right text-primary">
                <Link to="/forgot-password">
                  <span className="text-sm hover:text-primary hover:underline cursor-pointer transition duration-200">
                    Forgot Password?
                  </span>
                </Link>
              </div>

              <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>

              <button
                type="submit"
                className={`btn mt-2 w-full btn-primary ${loading ? "loading" : ""}`}
              >
                Login
              </button>

              <div className="text-center mt-4">
                Don't have an account yet?{" "}
                <Link to="/register">
                  <span className="hover:text-primary hover:underline cursor-pointer transition duration-200">
                    Register
                  </span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
