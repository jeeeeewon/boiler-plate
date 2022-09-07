import { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { auth } from '../_actions/user_action'

export default function saga(SpecificComponent, option, adminRoute = null){
  /*
  option
    null => 아무나 출입가능
    true => 로그인만 유저만 출입가능
    false => 로그인한 유저는 출입불가능
  adminRoute 
    default는 null
    trun => 어드민자격만
  */
  function AuthenticationCheck(){
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=> {
      dispatch(auth()).then(response => {
          console.log(response)

          //로그인하지않은 상태
          if(!response.payload.isAuth){
            if(option){
              navigate('/login')
            }
          //로그인한 상태
          } else{
            if(adminRoute && !response.payload.isAdim){
              navigate('/')
            } else{
              if(option === false){
                navigate('/')
              }
            }
          }


        })
    });
    return (
      < SpecificComponent />
    )
  }
  return AuthenticationCheck
}