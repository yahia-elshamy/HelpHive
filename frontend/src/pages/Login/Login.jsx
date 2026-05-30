import Styles from "./Login.module.css";
import Logo from "../../assets/icons/logo.png";
import HorizontalDivider from "../../assets/images/HorizontalDivider.png";
import loginWing from "../../assets/images/loginWing.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { loginUser } from "../../services/authService.js";
import { setCredentials } from "../../redux/auth/authSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setServerError("");
    setIsLoading(true);

    try {
      const response = await loginUser(data);

      dispatch(
        setCredentials({
          user: response.user,
          accessToken: response.accessToken,
        }),
      );

      navigate("/home");
    } catch (error) {
      const message =
        error.response?.data?.message || "Something went wrong, try again.";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const location = useLocation();
  const successMessage = location.state?.message;

  return (
    <>
      <main>
        <div
          className={`${Styles.mainCont} container-fluid w-100 d-flex align-items-center justify-content-center`}
        >
          <img
            src={loginWing}
            alt="Decorative image"
            className={Styles.loginWing}
          />

          <div className={Styles.loginCont}>
            <div className={Styles.logoCont}>
              <div className={Styles.logoBackground}>
                <img src={Logo} alt="Website Logo" />
              </div>
            </div>

            <div
              className={`${Styles.headerCont} d-flex flex-column align-items-center gap-2`}
            >
              <h1>Welcome back to the Hive.</h1>
              <p>Log in to continue your journey.</p>
            </div>

            {serverError && (
              <div
                className="alert alert-danger w-100 py-2 text-center rounded-3"
                role="alert"
              >
                {serverError}
              </div>
            )}

            {successMessage && (
              <div className={Styles.successAlert}>
                <i className="fa-regular fa-circle-check me-2"></i>
                {successMessage}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className={`${Styles.loginForm} d-flex flex-column gap-4 pt-2 w-100`}
              noValidate
            >
              <div
                className={`${Styles.loginForm} d-flex flex-column gap-4 pt-2 w-100`}
              >
                <div
                  className={`${Styles.emailField} d-flex flex-column align-items-start gap-2`}
                >
                  <label htmlFor="email">Email Address</label>
                  <div
                    className={`${Styles.emailInput} d-flex gap-2 align-items-center w-100 border border-1 p-3 rounded-4`}
                  >
                    <i className="fa-regular fa-envelope fs-4"></i>
                    <input
                      type="email"
                      id="email"
                      placeholder="name@example.com"
                      className="w-100 border-0"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <span className="text-danger small w-100">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div
                  className={`${Styles.passwordField} d-flex flex-column gap-2`}
                >
                  <div
                    className={`${Styles.PassTextCont} d-flex justify-content-between pe-3`}
                  >
                    <label htmlFor="password">Password</label>
                    <Link
                      to="/forgot-password"
                      className="text-decoration-none"
                    >
                      <span>Forgot Password?</span>
                    </Link>
                  </div>

                  <div
                    className={`${Styles.passwordInput} d-flex gap-2 align-items-center w-100 border border-1 p-3 rounded-4`}
                  >
                    <i className="fa-solid fa-lock fs-4"></i>
                    <input
                      type="password"
                      id="password"
                      placeholder="Enter a strong Password"
                      className="w-100 border-0"
                      {...register("password", {
                        required: "Password is Required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      })}
                    />
                  </div>
                  {errors.password && (
                    <span className="text-danger small">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                <div className={`${Styles.loginBtn} w-100`}>
                  <button
                    className="w-100 py-3 px-4 border-0 rounded-4"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Logging In..."
                    ) : (
                      <>
                        Log In{" "}
                        <i className="fa-solid fa-arrow-right ps-2 fs-5 align-bottom"></i>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            <div className="seperator w-100">
              <div className={`${Styles.horizontalDivider} w-100`}>
                <img
                  src={HorizontalDivider}
                  alt="Decorative Horizontal Divider"
                />
                <span>OR CONTINUE WITH</span>
                <img
                  src={HorizontalDivider}
                  alt="Decorative Horizontal Divider"
                />
              </div>
            </div>

            <div className={`${Styles.socialLogins} d-flex gap-3`}>
              <button>
                <i className="fa-brands fa-google"></i>
              </button>
              <button>
                <i className="fa-brands fa-facebook-f"></i>
              </button>
            </div>

            <div className={Styles.signupPrompt}>
              <p>
                Don't have an account?{" "}
                <Link to="/register" className="text-decoration-none">
                  <span>Sign Up</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
