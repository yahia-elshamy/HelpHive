import Styles from './Register.module.css';
import HiveIcon from "../../assets/icons/HiveIcon.png"
import AddImageIcon from "../../assets/icons/AddImageIcon.png"
import { Link } from 'react-router-dom';


export default function Signup() {
    return(<>
        <div className={`${Styles.mainCon} py-5 px-4 d-flex justify-content-center`}>
            <div className={`${Styles.contentCon} d-flex flex-column gap-4`}>

                <div className={`${Styles.headerCon} d-flex flex-column align-items-center gap-2`}>
                    <img src={HiveIcon} alt="Hive Icon" />
                    <h1>HelpHive</h1>
                    <p>Start your honey-making journey.</p>
                </div>

                <div className={`${Styles.mainFormCon} border border-1 rounded-4 p-4 d-flex flex-column align-items-center gap-4 mx-4`}>
                    <div className="addImageCon d-flex flex-column align-items-end position-relative">
                    <div className={Styles.hexagonBorder}>
                        <img src={AddImageIcon} alt="add image icon" />
                    </div>
                        <button className='position-absolute bottom-0 border-0 rounded-circle px-2 fw-bold bg-warning'>+</button>
                    </div>

                    <div className={`${Styles.formCon} d-flex flex-column align-items-center gap-3 w-100`}>

                        <div className="fullNameField d-flex flex-column align-items-start w-100">
                            <label htmlFor="fullName">Full Name</label>
                            <div className={`${Styles.fullNameInput} w-100 d-flex align-items-center gap-1 bg-body rounded-3 p-3 mt-2`}>
                                <i className="fa-regular fa-user fs-5"></i>
                                <input type="text" id="fullName" placeholder="Worker Bee" className="w-100 border-0 bg-transparent" />
                            </div>
                        </div>

                        <div className="emailField d-flex flex-column align-items-start w-100">
                            <label htmlFor="email">Email Address</label>
                            <div className={`${Styles.emailInput} w-100 d-flex align-items-center gap-1 bg-body rounded-3 p-3 mt-2`}>
                                <i className="fa-regular fa-envelope fs-5"></i>
                                <input type="text" id="email" placeholder="buzz@helphive.com" className="w-100 border-0 bg-transparent" />
                            </div>
                        </div>

                        <div className="passwordField d-flex flex-column align-items-start w-100">
                            <label htmlFor="password">Password</label>
                            <div className={`${Styles.passwordInput} w-100 d-flex align-items-center gap-1 bg-body rounded-3 p-3 mt-2`}>
                                <i className="fa-solid fa-lock fs-5"></i>
                                <input type="password" id="password" placeholder="Enter a strong password" className="w-100 border-0 bg-transparent" />
                            </div>
                        </div>

                    </div>

                    <div className={`${Styles.roleCon} d-flex flex-column w-100 gap-2 pt-1`}>

                        <span>How will you participate?</span>

                        <div className={`${Styles.optionCon} d-flex gap-3`}>
                            <button className="volunteerOption w-50 d-flex flex-column align-items-center py-3 rounded-3 border border-1 bg-body gap-1">
                                <i className="fa-solid fa-hand-holding-heart fs-5"></i>
                                <span>Volunteer</span>
                            </button>
                            <button className="requesterOption w-50 d-flex flex-column align-items-center py-3 rounded-3 border border-1 bg-body">
                                <i class="fa-regular fa-hand fs-5"></i>
                                <span>Requester</span>
                            </button>
                        </div>

                    </div>

                    <button className={`${Styles.signUpBtn} w-100 border-0 py-3 rounded-4 d-flex gap-2 justify-content-center align-items-center`}>Join the Hive <i className="fa-solid fa-arrow-right fs-6"></i></button>

                </div>

                <div className={`${Styles.loginPrompt} text-center`}>
                    <p>Already part of the swarm? <Link to="/login" className='text-decoration-none'><span>Login</span></Link></p>
                </div>

            </div>
        </div>
    </>)
}