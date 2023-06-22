import { useLocation, useNavigate } from "react-router-dom";
import React, { useRef, useState } from "react";
import "../../styles/pages/Login.css";
import axios from "axios";

import { UserModel } from "../../Models/UserModels";
import MainPage from "../MainPage";
import LoginComponent from "../Login";

var API_URL = "http://localhost:8080"

function getUserName() : string {
    return localStorage.getItem("Username") || "User xpto";
}


function UserChangeAtributes() {
    const navigate = useNavigate();
    var Page_Name = "Alterar dados Utilizador";
    const UserNameInput = useRef<HTMLInputElement>(null);
    const PasswordInput = useRef<HTMLInputElement>(null);
    const EmailInput = useRef<HTMLInputElement>(null);
    const [erroLogin, setErroLogin] = useState(false);

    const goTo = () => {
            navigate("/");
    }

    const DoesChange = async () => {
        var requestBody : UserModel = {
            username: getUserName(),
            password: PasswordInput.current?.value || ""
        };

        if (UserNameInput.current?.value !== ""){
            requestBody.username = UserNameInput.current?.value || "";
        }

        if (PasswordInput.current?.value !== ""){

            var x = document.getElementById("RePassword") as any;
            if (x.value !== PasswordInput.current?.value ) {
                setErroLogin(true);
                return;
            }

            requestBody.password = PasswordInput.current?.value || "";

        }          
        
        if (EmailInput.current?.value !== ""){
            const regex =new RegExp('([a-zA-z0-9_.+-]+)@[a-zA-z0-9_.+-]+.([a-z]+)');
            if(regex.test(EmailInput.current?.value || "")){
                requestBody.email = EmailInput.current?.value;
            }else{
                setErroLogin(true);
                return;
            }
        }

        try{
            await axios
                .put(API_URL+ "/user/userdetails/" + localStorage.getItem("userID"), requestBody)
                .then((response: any) =>{
                    localStorage.setItem("Username", requestBody.username);
                    navigate("/");
                })

        }catch(error){
            console.log(error)
        }
    }

    
    var ThisComponent = (
        <div>
            <section className="vh-100">
                <div className="container-fluid h-custom">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-md-9 col-lg-6 col-xl-5">
                            <img src={ process.env.PUBLIC_URL + "/img/img_login.jpg" } className="img-fluid" alt="Sample"></img>
                        </div>
                        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">

                            <div>
                                <h3>Olá { getUserName() }</h3>
                                <p>Aqui pode alterar as suas informações pessoais</p>
                                <br />
                            </div>

                            <form>

                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="usernameInput">Username</label>
                                    <input type="text" ref={UserNameInput} className={erroLogin ? 'form-control form-control-lg errorLoginRegister' : 'form-control form-control-lg' }
                                        placeholder="Enter your Username" />
                                    
                                </div>

                                <div className="form-outline mb-3">
                                    <label className="form-label" htmlFor="form3Example4">new Password</label>
                                    <input type="password" ref={PasswordInput} className={erroLogin ? 'form-control form-control-lg errorLoginRegister' : 'form-control form-control-lg' }
                                        placeholder="Enter your password" />
                                    
                                </div>

                                <div>
                                    <div className="form-outline mb-3">
                                        <label className="form-label" htmlFor="form3Example5">Confirm new Password</label>
                                        <input type="password" id="RePassword" className={erroLogin ? 'form-control form-control-lg errorLoginRegister' : 'form-control form-control-lg' } placeholder="Confirm your password" />
                                        
                                    </div>

                                    <div className="form-outline mb-3">
                                        <label className="form-label" htmlFor="form3Example5">Email</label>
                                        <input type="email" id="EmailInput" ref={EmailInput} className={erroLogin ? 'form-control form-control-lg errorLoginRegister' : 'form-control form-control-lg' } placeholder="Email" />
                                        
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    { erroLogin && (
                                        <label htmlFor="erro" className="erroLabel">Erro no { Page_Name.toString() }</label>
                                    )}
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <div className="text-center text-lg-start mt-4 pt-2">
                                            <button type="button" id="btn_login_3" className="btn btn-primary btn-lg"
                                                onClick={ DoesChange }
                                            >
                                                { Page_Name }
                                            </button>
                                        </div>

                                        <div className="text-center text-lg-start mt-4 pt-2">
                                            <button type="button" id="btn_login_2" className="btn btn-primary btn-lg" style={{ backgroundColor: 'white', color: '#0d6efd' }}
                                            onClick={goTo}
                                            >
                                                { 'Voltar' }
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                { erroLogin && (
                                    <label htmlFor="erro" className="erroLabel">Erro no { Page_Name.toString() }</label>
                                )}

                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );

    if (localStorage.getItem('userID') === null){
        return (
            <div>
                <h1>Erro… Voltar à pagina principal</h1>
                <button type="button" id="btn_login" className="btn btn-primary btn-lg" onClick={ goTo } >
                    Página Principal
                </button>
            </div>
        )
    }else{
        //ir buscar info dele
        return (ThisComponent);
    }
    
}

export default UserChangeAtributes;