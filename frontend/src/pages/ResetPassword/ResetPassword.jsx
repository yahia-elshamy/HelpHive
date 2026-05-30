import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPasswordRequest } from "../../services/authService";
import Styles from "./ResetPassword.module.css";
import HiveIcon from "../../assets/icons/HiveIcon.png";

export default function ResetPassword() {
  // Get the token from the URL: /reset-password/:token
  const { token } = useParams();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch, // we need this to compare password fields
    formState: { errors },
  } = useForm();

  // watch('password') gives us the live value of the password field
  // We use it to validate that confirmPassword matches
  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError("");

    try {
      await resetPasswordRequest(token, data.password);

      // Navigate to login with a state flag so Login page can show success toast
      navigate("/login", {
        state: { message: "Password reset successfully. Please log in." },
      });
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          "Invalid or expired link. Please request a new one.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`${Styles.mainCon} d-flex justify-content-center align-items-center`}
    >
      <div
        className={`${Styles.cardCon} border border-1 rounded-4 p-4 d-flex flex-column align-items-center gap-4`}
      >
        {/* Logo */}
        <img src={HiveIcon} alt="HelpHive" className={Styles.icon} />

        {/* Header */}
        <div className={`${Styles.headerCon} text-center`}>
          <h1>Set new password</h1>
          <p>Choose a strong password for your account.</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-100 d-flex flex-column gap-3"
          noValidate
        >
          {/* ---- New Password Field ---- */}
          <div className="d-flex flex-column gap-2">
            <label htmlFor="password" className={Styles.label}>
              New Password
            </label>
            <div
              className={`${Styles.inputWrapper} d-flex align-items-center gap-2 rounded-3 p-3`}
            >
              <i className="fa-solid fa-lock fs-5"></i>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter a strong password"
                className="border-0 bg-transparent w-100"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  maxLength: {
                    value: 64,
                    message: "Password must be at most 64 characters",
                  },
                })}
              />
              {/* Toggle show/hide */}
              <button
                type="button"
                className={Styles.eyeBtn}
                onClick={() => setShowPassword((p) => !p)}
                tabIndex={-1}
              >
                <i
                  className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>
            {errors.password && (
              <span className={Styles.errorMsg}>
                <i className="fa-solid fa-circle-exclamation me-1"></i>
                {errors.password.message}
              </span>
            )}
          </div>

          {/* ---- Confirm Password Field ---- */}
          <div className="d-flex flex-column gap-2">
            <label htmlFor="confirmPassword" className={Styles.label}>
              Confirm Password
            </label>
            <div
              className={`${Styles.inputWrapper} d-flex align-items-center gap-2 rounded-3 p-3`}
            >
              <i className="fa-solid fa-lock fs-5"></i>
              <input
                type={showConfirm ? "text" : "password"}
                id="confirmPassword"
                placeholder="Repeat your password"
                className="border-0 bg-transparent w-100"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === passwordValue || "Passwords do not match",
                })}
              />
              <button
                type="button"
                className={Styles.eyeBtn}
                onClick={() => setShowConfirm((p) => !p)}
                tabIndex={-1}
              >
                <i
                  className={`fa-regular ${showConfirm ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>
            {errors.confirmPassword && (
              <span className={Styles.errorMsg}>
                <i className="fa-solid fa-circle-exclamation me-1"></i>
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* Server Error */}
          {serverError && (
            <div className={Styles.serverError}>
              <i className="fa-solid fa-triangle-exclamation me-2"></i>
              {serverError}{" "}
              <Link to="/forgot-password" className={Styles.retryLink}>
                Request a new link
              </Link>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`${Styles.submitBtn} w-100 border-0 py-3 rounded-4 mt-1`}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Resetting...
              </>
            ) : (
              <>
                Reset Password
                <i className="fa-solid fa-arrow-right ms-2"></i>
              </>
            )}
          </button>

          {/* Back to login */}
          <div className={`${Styles.loginPrompt} text-center`}>
            <p>
              Remembered it?{" "}
              <Link to="/login" className="text-decoration-none">
                <span>Back to Login</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
