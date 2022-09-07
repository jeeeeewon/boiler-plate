import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Auth from '../../../hoc/auth';

function LandingPage() {
  useEffect(() => {
    axios.get('/api/hello')
  }, []);

  const navigate = useNavigate();
  const onClickHandler = ()=> {
    axios.get('/api/users/logout')
      .then(response => {
        if(response.data.success === true){
          navigate('/login')
        } else{
          alert('Failed to logout');
        }
      });
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh'
    }}>
      <h2>시작페이지</h2>
      <button onClick={onClickHandler}>
        Logout
      </button>
    </div>
  )
}

export default Auth(LandingPage, null);