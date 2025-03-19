import { Outlet, useNavigate } from 'react-router-dom'
import './RegisterPage.css'

const RegisterPage = ()=>{
    const navigate=useNavigate();
    return (
        <div>
            <h1 className='main-heading'>Create your account now to get started!</h1>
            <p>Whether you're a player searching for your local club or an organization seeking to streamline management, PLUP offers tailored solutions to meet your needs.</p>
            <div className="cards-container">
                <div className='card'>
                    <img src='src\assets\user-setting_18055363.png'/>
                    <div className='description'>
                        <img src='src\assets\logo.png'/>
                        <h2 >I'm Club</h2>
                        <p >Complete your club's details and kick off a 30-day free trial today!</p>
                        <button onClick={() => navigate("/register/organization")}>Create a New Club</button>
                    </div>
                </div>
                <div className='card'>
                    <img src='src\assets\ping-pong_9045378.png'/>
                    <div className='description'>
                        <img src='src\assets\logo.png'/>
                        <h2>I'm Player</h2>
                        <p>Find a participating club in PLUP and sign up to create your account.</p>
                        <button >Find or Join a Club</button>
                    </div>
                </div>
            </div>
            <Outlet />
      </div>      
    )
}

export default RegisterPage