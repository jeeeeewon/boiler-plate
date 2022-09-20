import React from 'react'
import { FaCode } from "react-icons/fa";
import Auth from '../../../hoc/auth';

function LandingPage() {
    return (
        <>
            <div className="app">
                <FaCode style={{ fontSize: '4rem' }} /><br />
                <span style={{ fontSize: '2rem' }}>Let's Start Coding!</span>
            </div>
        </>
    )
}

export default Auth(LandingPage, null);
