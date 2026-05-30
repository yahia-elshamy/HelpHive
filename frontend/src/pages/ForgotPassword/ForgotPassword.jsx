import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { forgotPasswordRequest } from '../../services/authService';
import Styles from './ForgotPassword.module.css';
import HiveIcon from '../../assets/icons/HiveIcon.png';

export default function ForgotPassword() {
    // Controls whether we show the form or the success message
    const [submitted, setSubmitted] = useState(false);
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        setServerError('');

        try {
            await forgotPasswordRequest(data.email);
            // Always show success — backend doesn't reveal if email exists
            setSubmitted(true);
        } catch (err) {
            setServerError(
                err.response?.data?.message || 'Something went wrong. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`${Styles.mainCon} d-flex justify-content-center align-items-center`}>

            <div className={`${Styles.cardCon} border border-1 rounded-4 p-4 d-flex flex-column align-items-center gap-4`}>

                {/* Logo */}
                <img src={HiveIcon} alt="HelpHive" className={Styles.icon} />

                {/* Header */}
                <div className={`${Styles.headerCon} text-center`}>
                    <h1>Reset your password</h1>
                    <p>Enter your email and we'll send you a reset link.</p>
                </div>

                {/* SUCCESS STATE — show this instead of form after submit */}
                {submitted ? (
                    <div className={`${Styles.successBox} w-100 text-center`}>
                        <i className="fa-regular fa-circle-check fs-1 mb-3"></i>
                        <p>
                            If an account with that email exists, a reset link has been sent.
                            Check your inbox.
                        </p>
                        <Link to="/login" className={`${Styles.backBtn} mt-2 d-inline-block`}>
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    /* FORM STATE */
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-100 d-flex flex-column gap-3"
                        noValidate
                    >
                        {/* Email Field */}
                        <div className="d-flex flex-column gap-2">
                            <label htmlFor="email" className={Styles.label}>
                                Email Address
                            </label>
                            <div className={`${Styles.inputWrapper} d-flex align-items-center gap-2 rounded-3 p-3`}>
                                <i className="fa-regular fa-envelope fs-5"></i>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="buzz@helphive.com"
                                    className="border-0 bg-transparent w-100"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Enter a valid email address'
                                        }
                                    })}
                                />
                            </div>
                            {/* Validation error */}
                            {errors.email && (
                                <span className={Styles.errorMsg}>
                                    <i className="fa-solid fa-circle-exclamation me-1"></i>
                                    {errors.email.message}
                                </span>
                            )}
                        </div>

                        {/* Server Error */}
                        {serverError && (
                            <div className={Styles.serverError}>
                                <i className="fa-solid fa-triangle-exclamation me-2"></i>
                                {serverError}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`${Styles.submitBtn} w-100 border-0 py-3 rounded-4`}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    Send Reset Link
                                    <i className="fa-solid fa-arrow-right ms-2"></i>
                                </>
                            )}
                        </button>

                        {/* Back to login */}
                        <div className={`${Styles.loginPrompt} text-center`}>
                            <p>
                                Remembered it?{' '}
                                <Link to="/login" className="text-decoration-none">
                                    <span>Back to Login</span>
                                </Link>
                            </p>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}