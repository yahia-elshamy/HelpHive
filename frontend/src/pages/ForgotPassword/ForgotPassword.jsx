import Styles from './ForgotPassword.module.css';
import HoeyDropIcon from '../../assets/icons/HoneyDropIcon.png';
import ResetPassIcon from '../../assets/icons/ResetPassIcon.png';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    return(<>
        <div className={`${Styles.resetPassPage} d-flex flex-column align-items-center text-center py-5`}>
            <div className={`${Styles.mainCon} d-flex flex-column gap-5`}>
                <div className="icon opacity-25">
                    <img src={HoeyDropIcon} alt="honey-drop icon" />
                </div>

                <div className={`${Styles.formCon} p-4 border rounded-4 overflow-hidden d-flex flex-column gap-4`}>
                    <div className={`${Styles.headerCon} d-flex flex-column align-items-center gap-3`}>
                        <div className={Styles.resetPassIconCon}>
                            <img src={ResetPassIcon} alt="reset password icon" />
                        </div>

                        <h1>Need a hand finding your way back?</h1>
                        <p>Enter your registered email address and we'll send you a link to reset your password.</p>
                    </div>

                    <div className={`${Styles.submitCon} d-flex flex-column gap-4`}>
                        <div className="emailField d-flex flex-column gap-1 align-items-start">
                            <label htmlFor="email">Email Address</label>
                            <div className={`${Styles.emailInput} d-flex gap-1 align-items-center w-100 p-3 rounded-3`}>
                                <i className="fa-regular fa-envelope fs-5"></i>
                                <input type="text" id="email" placeholder="beekeeper@helphive.com" className="w-100 border-0 bg-transparent" />
                            </div>
                        </div>
                        <button className='p-3 d-flex justify-content-center align-items-center gap-2 border-0 rounded-3'>Send Reset Link <i className="fa-solid fa-plane-departure"></i></button>
                    </div>

                    <div className={`${Styles.navLogin} d-flex justify-content-center align-items-center gap-3`}>
                        <div className={Styles.hexagonBorder}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </div>
                        <Link to="/login" className="text-decoration-none"><span>Back to Login</span></Link>
                    </div>

                </div>

            </div>
        </div>
    </>)
}