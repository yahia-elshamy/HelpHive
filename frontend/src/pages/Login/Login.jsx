import Styles from './Login.module.css'
import Logo from '../../assets/icons/logo.png'
import HorizontalDivider from '../../assets/images/HorizontalDivider.png'
import loginWing from "../../assets/images/loginWing.png"
import { Link } from 'react-router-dom'

export default function Login() {
  return (<>
        <main>
            <div className={`${Styles.mainCont} container-fluid w-100 d-flex align-items-center justify-content-center`}>
                <img src={loginWing} alt="Decorative image" className={Styles.loginWing} />

                <div className={Styles.loginCont}>
                    <div className={Styles.logoCont}>
                        <div className={Styles.logoBackground}>
                            <img src={Logo} alt="Website Logo" />
                        </div>
                    </div>
                    
                    <div className={`${Styles.headerCont} d-flex flex-column align-items-center gap-2`}>
                        <h1>Welcome back to the Hive.</h1>
                        <p>Log in to continue your journey.</p>
                    </div>

                    <div className={`${Styles.loginForm} d-flex flex-column gap-4 pt-2 w-100`}>
                        <div className={`${Styles.emailField} d-flex flex-column align-items-start gap-2`}>
                            <label htmlFor="email">Email Address</label>
                            <div className={`${Styles.emailInput} d-flex gap-2 align-items-center w-100 border border-1 p-3 rounded-4`}>
                                <i className="fa-regular fa-envelope fs-4"></i>
                                <input type="email" id='email' placeholder='name@example.com' className='w-100 border-0'/>
                            </div>
                        </div>

                        <div className={`${Styles.passwordField} d-flex flex-column gap-2`}>
                            <div className={`${Styles.PassTextCont} d-flex justify-content-between pe-3`}>
                                <label htmlFor="password">Password</label>
                                <span>Forgot Password?</span>
                            </div>

                            <div className={`${Styles.passwordInput} d-flex gap-2 align-items-center w-100 border border-1 p-3 rounded-4`}>
                                <i className="fa-solid fa-lock fs-4"></i>
                                <input type="password" id="password" placeholder="Enter a strong Password" className='w-100 border-0'/>
                            </div>
                        </div>

                        <div className={`${Styles.loginBtn} w-100`}>
                            <button className='w-100 py-3 px-4 border-0 rounded-4'>Log In <i className="fa-solid fa-arrow-right ps-2 fs-5 align-bottom"></i></button>
                        </div>
                    </div>

                    <div className="seperator w-100">
                        <div className={`${Styles.horizontalDivider} w-100`}>
                            <img src={HorizontalDivider} alt="Decorative Horizontal Divider" />
                            <span>OR CONTINUE WITH</span>
                            <img src={HorizontalDivider} alt="Decorative Horizontal Divider" />
                        </div>
                    </div>

                    <div className={`${Styles.socialLogins} d-flex gap-3`}>
                        <button><i className="fa-brands fa-google"></i></button>
                        <button><i className="fa-brands fa-facebook-f"></i></button>
                    </div>
                    
                    <div className={Styles.signupPrompt}>
                        <p>Don't have an account? <Link to="/signup" className='text-decoration-none'><span>Sign Up</span></Link></p>
                    </div>
                </div>

            </div>
        </main>
    </>)
}
