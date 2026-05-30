import Styles from "./Register.module.css";
import HiveIcon from "../../assets/icons/HiveIcon.png";
import AddImageIcon from "../../assets/icons/AddImageIcon.png";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { registerUser } from "../../services/authService.js";
import { setCredentials } from "../../redux/auth/authSlice.js";

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Local state — only for things RHF doesn't manage
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ─── React Hook Form setup ──────────────────────────────────────
  const {
    register,
    handleSubmit,
    setValue, // lets us set a field value manually
    watch, // lets us read a field value live
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "requester", // default role matches your backend default
    },
  });

  // Watch role so we can highlight the selected button
  const selectedRole = watch("role");

  // ─── Avatar preview handler ─────────────────────────────────────
  // When user picks a file, show a preview immediately
  // We do NOT use register() for file inputs — we handle manually
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Store the actual File object in RHF so it's available on submit
    setValue("avatar", file);

    // Create a temporary URL for preview using FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result); // base64 data URL for <img>
    };
    reader.readAsDataURL(file);
  };

  // ─── Submit handler ─────────────────────────────────────────────
  const onSubmit = async (data) => {
    setServerError("");
    setIsLoading(true);

    try {
      // Build FormData — required because we're sending a file
      // Axios will automatically set Content-Type: multipart/form-data
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role);

      // Only append avatar if user selected one
      if (data.avatar) {
        formData.append("avatar", data.avatar);
      }

      const response = await registerUser(formData);

      // Save to Redux — same pattern as Login
      dispatch(
        setCredentials({
          user: response.user,
          accessToken: response.accessToken,
        }),
      );

      navigate("/home");
    } catch (error) {
      const message =
        error.response?.data?.message || "Registration failed. Try again.";
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <div
      className={`${Styles.mainCon} py-5 px-4 d-flex justify-content-center`}
    >
      <div className={`${Styles.contentCon} d-flex flex-column gap-4`}>
        {/* Header */}
        <div
          className={`${Styles.headerCon} d-flex flex-column align-items-center gap-2`}
        >
          <img src={HiveIcon} alt="Hive Icon" />
          <h1>HelpHive</h1>
          <p>Start your honey-making journey.</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={`${Styles.mainFormCon} border border-1 rounded-4 p-4 d-flex flex-column align-items-center gap-4 mx-4`}
        >
          {/* Server error banner */}
          {serverError && (
            <div
              className="alert alert-danger w-100 py-2 text-center rounded-3"
              role="alert"
            >
              {serverError}
            </div>
          )}

          {/* ── Avatar Upload ── */}
          <div className="d-flex flex-column align-items-center gap-2">
            <label
              htmlFor="avatarInput"
              style={{ cursor: "pointer" }}
              title="Click to upload avatar"
            >
              <div
                className={Styles.hexagonBorder}
                style={{ overflow: "hidden", width: 80, height: 80 }}
              >
                {avatarPreview ? (
                  // Show selected image preview
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  // Default icon before selection
                  <img
                    src={AddImageIcon}
                    alt="Add avatar"
                    style={{ width: "100%" }}
                  />
                )}
              </div>
            </label>

            {/* Hidden file input — triggered by clicking the label above */}
            <input
              type="file"
              id="avatarInput"
              accept="image/jpeg,image/png,image/webp"
              className="d-none"
              onChange={handleAvatarChange}
            />
            <small className="text-muted">Click to upload photo</small>
          </div>

          {/* ── Form Fields ── */}
          <div
            className={`${Styles.formCon} d-flex flex-column align-items-center gap-3 w-100`}
          >
            {/* Full Name */}
            <div className="d-flex flex-column align-items-start w-100">
              <label htmlFor="fullName">Full Name</label>
              <div
                className={`${Styles.fullNameInput} w-100 d-flex align-items-center gap-1 bg-body rounded-3 p-3 mt-2 ${errors.name ? "border border-danger" : ""}`}
              >
                <i className="fa-regular fa-user fs-5"></i>
                <input
                  type="text"
                  id="fullName"
                  placeholder="Worker Bee"
                  className="w-100 border-0 bg-transparent"
                  {...register("name", {
                    required: "Full name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "Name must be at most 50 characters",
                    },
                  })}
                />
              </div>
              {errors.name && (
                <span className="text-danger small mt-1">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="d-flex flex-column align-items-start w-100">
              <label htmlFor="email">Email Address</label>
              <div
                className={`${Styles.emailInput} w-100 d-flex align-items-center gap-1 bg-body rounded-3 p-3 mt-2 ${errors.email ? "border border-danger" : ""}`}
              >
                <i className="fa-regular fa-envelope fs-5"></i>
                <input
                  type="email"
                  id="email"
                  placeholder="buzz@helphive.com"
                  className="w-100 border-0 bg-transparent"
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
                <span className="text-danger small mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="d-flex flex-column align-items-start w-100">
              <label htmlFor="password">Password</label>
              <div
                className={`${Styles.passwordInput} w-100 d-flex align-items-center gap-1 bg-body rounded-3 p-3 mt-2 ${errors.password ? "border border-danger" : ""}`}
              >
                <i className="fa-solid fa-lock fs-5"></i>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter a strong password"
                  className="w-100 border-0 bg-transparent"
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
              </div>
              {errors.password && (
                <span className="text-danger small mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>

          {/* ── Role Selection ── */}
          <div
            className={`${Styles.roleCon} d-flex flex-column w-100 gap-2 pt-1`}
          >
            <span>How will you participate?</span>

            {/*
              Hidden input registers "role" with RHF.
              The buttons below call setValue() to update it.
            */}
            <input type="hidden" {...register("role")} />

            <div className={`${Styles.optionCon} d-flex gap-3`}>
              {/* Volunteer button */}
              <button
                type="button"
                onClick={() => setValue("role", "volunteer")}
                className={`w-50 d-flex flex-column align-items-center py-3 rounded-3 border border-1 bg-body gap-1
                  ${
                    selectedRole === "volunteer"
                      ? "border-warning bg-warning bg-opacity-10"
                      : ""
                  }`}
              >
                <i className="fa-solid fa-hand-holding-heart fs-5"></i>
                <span>Volunteer</span>
              </button>

              {/* Requester button */}
              <button
                type="button"
                onClick={() => setValue("role", "requester")}
                className={`w-50 d-flex flex-column align-items-center py-3 rounded-3 border border-1 bg-body gap-1
                  ${
                    selectedRole === "requester"
                      ? "border-warning bg-warning bg-opacity-10"
                      : ""
                  }`}
              >
                <i className="fa-regular fa-hand fs-5"></i>
                <span>Requester</span>
              </button>
            </div>
          </div>

          {/* ── Submit Button ── */}
          <button
            type="submit"
            disabled={isLoading}
            className={`${Styles.signUpBtn} w-100 border-0 py-3 rounded-4 d-flex gap-2 justify-content-center align-items-center`}
          >
            {isLoading ? (
              "Creating account..."
            ) : (
              <>
                Join the Hive <i className="fa-solid fa-arrow-right fs-6"></i>
              </>
            )}
          </button>
        </form>

        {/* Login prompt */}
        <div className={`${Styles.loginPrompt} text-center`}>
          <p>
            Already part of the swarm?{" "}
            <Link to="/login" className="text-decoration-none">
              <span>Login</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
