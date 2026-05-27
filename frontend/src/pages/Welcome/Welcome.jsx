import Styles from './Welcome.module.css';
import Logo from '../../assets/icons/logo.png'
import FriendlyBee from '../../assets/images/FriendlyBeeIllustration.png'
import DecorativeRightWing from '../../assets/images/DecorativeRightWing.png'
import DecorativeLeftWing from '../../assets/images/DecorativeLeftWing.png'
import { Link } from 'react-router-dom';

export default function Welcome(){
    return(<>
        <div className={`${Styles.welcomeCon} d-flex justify-content-between align-content-center`}>
            <div className={`leftDecorate d-flex flex-column justify-content-end ${Styles.DecorativeLeftWing}`}><img src={DecorativeLeftWing} alt="Decorative Left Wing" /></div>
            <main className='mainContent d-flex align-items-center flex-column gap-5'>
                <div className={Styles.logoCon}>
                    <img src={Logo} alt="HelpHive Logo" />
                </div>
                <div className={Styles.beeCont}>
                    <img src={FriendlyBee} alt="Bee Decorate" />
                </div>
                <div className={`${Styles.textCont} text-center`}>
                    <h1>Small acts, big impact.</h1>
                    <p>Join the hive and start making a difference in your community today.</p>
                </div>
                <div className='d-flex flex-column justify-content-center align-content-center w-100'>
                    <button className={Styles.getStartedBtn}>Get Started <i class="fa-solid fa-arrow-right ms-1"></i></button>
                    <div className='w-100 d-flex justify-content-center gap-2 pt-2'>
                        <Link to="/login"><button className={Styles.loginBtn}>Login</button></Link>
                        <span>•</span>
                        <Link to="/signup"><button className={Styles.joinBtn}>Join the Hive</button></Link>
                    </div>
                </div>
            </main>
            <div className={`rightDecorate d-flex flex-column justify-content-start ${Styles.DecorativeRightWing}`}><img src={DecorativeRightWing} alt="Decorative Right Wing" /></div>
        </div>
    </>)
}