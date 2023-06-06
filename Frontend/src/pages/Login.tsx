import { useLocation, useNavigate } from "react-router-dom";
import React, { useRef, useState } from "react";
import "../";
import "../styles/pages/Login.css";
import axios from "axios";

import { UserModel } from "../Models/UserModels";
import MainPage from "./MainPage";

var API_URL = "http://localhost:8080"


function LoginComponent() {
    const navigate = useNavigate();
    var Page_Name = useLocation().pathname.replace("/", "");
    const UserNameInput = useRef<HTMLInputElement>(null);
    const PasswordInput = useRef<HTMLInputElement>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [erroLogin, setErroLogin] = useState(false);

    React.useEffect(() => {
        if (showPopup) {
            setTimeout(() => {
                setShowPopup(false);
            }, 5000);
        }
    }, [showPopup]);

    if (Page_Name === "") { Page_Name = "Login"; }


    const goTo = () => {
        setErroLogin(false);
        if (Page_Name.toUpperCase().match("LOGIN") || Page_Name === "") {
        navigate("/register");
    } else if (Page_Name.toUpperCase().match("REGISTER")) {
        navigate("/");
    }
    }

    const DoesLogin = async () => {

        var requestBody: UserModel = {
            password: PasswordInput.current?.value || "",
            username: UserNameInput.current?.value || ""
        };

        if (requestBody.username === "" || requestBody.password === "") {
            setErroLogin(true);
            return;
        }

        if (Page_Name.toUpperCase().match("REGISTER")) {

            var x = document.getElementById("RePassword") as any;
            if (x.value !== requestBody.password) {
                setErroLogin(true);
                return;
            }

            x = document.getElementById("EmailInput") as any;
            const regex =new RegExp('([a-zA-z0-9_.+-]+)@[a-zA-z0-9_.+-]+.([a-z]+)');
            if(regex.test(x.value)){
                requestBody.email = x.value;
            } else {
                setErroLogin(true);
                return;
            }

            requestBody.active = true;

            try {
                await axios
                    .post(API_URL + "/user/authentication/register", requestBody)
                    .then((response: any) => {
                        navigate("/");
                    })

            } catch (error) {
                setErroLogin(true);
            }

        } else if (Page_Name.toUpperCase().match("LOGIN") || Page_Name === "") {

            try {
                await axios
                    .put(API_URL + "/user/authentication/login", requestBody)
                    .then((response: any) => {
                        var user = response.data as UserModel;
                        localStorage.setItem("userID", user.id?.toString() || "");
                        localStorage.setItem("Username", user.username || "");
                        navigate("/main");
                    });

            } catch (error) {
                localStorage.setItem("userID", "");
                localStorage.setItem("Username", "");
                navigate("/main");
                //setErroLogin(true);
            }
        }
    }

    var login_Registo = (
        <div>
            <section className="vh-100">
                <div className="container-fluid h-custom">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-md-9 col-lg-6 col-xl-5">
                            <img src={process.env.PUBLIC_URL + "/img/img_login.jpg"} className="img-fluid" alt="Sample"></img>
                        </div>
                        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                            <form>
                                <h3>Bem vindo ao Gestor de Referências Bibliográficas</h3>
                                <p>Insira os seus dados de {Page_Name.toUpperCase().match("LOGIN") ? 'login' : 'registo'}</p>
                                <br/>
                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="usernameInput">Username</label>
                                    <input type="text" ref={UserNameInput} className={erroLogin ? 'form-control form-control-lg errorLoginRegister' : 'form-control form-control-lg'}
                                        placeholder="Insira o seu Username" />

                                </div>

                                <div className="form-outline mb-3">
                                    <label className="form-label" htmlFor="form3Example4">Password</label>
                                    <input type="password" ref={PasswordInput} className={erroLogin ? 'form-control form-control-lg errorLoginRegister' : 'form-control form-control-lg'}
                                        placeholder="Insira a sua password" />

                                </div>

                                {Page_Name.toUpperCase().match("REGISTER") &&
                                    <div>
                                        <div className="form-outline mb-3">
                                            <label className="form-label" htmlFor="form3Example5">Confirmar Password</label>
                                            <input type="password" id="RePassword" className={erroLogin ? 'form-control form-control-lg errorLoginRegister' : 'form-control form-control-lg'} placeholder="Confirme a sua password" />

                                        </div>

                                        <div className="form-outline mb-3">
                                            <label className="form-label" htmlFor="form3Example5">Email</label>
                                            <input type="email" id="EmailInput" className={erroLogin ? 'form-control form-control-lg errorLoginRegister' : 'form-control form-control-lg'} placeholder="Insira o seu Email" />

                                        </div>
                                    </div>
                                }


                                <div style={{ display: 'flex', flexDirection: 'column' }}>{erroLogin && (
                                    <label htmlFor="erro" className="erroLabel">Erro ao efetuar {Page_Name.toUpperCase().match("LOGIN") ? 'login' : 'registo'}</label>
                                )}
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>

                                        <div className="text-center text-lg-start mt-4 pt-2">
                                            <button type="button" id="btn_login_1" className="btn btn-primary btn-lg"
                                                onClick={DoesLogin}
                                            >
                                                {Page_Name || "Login"}
                                            </button>
                                        </div>

                                        <div className="text-center text-lg-start mt-4 pt-2">
                                            <button type="button" id="btn_login_2" className="btn btn-primary btn-lg" onClick={goTo} style={{ backgroundColor: 'white', color: '#0d6efd' }}>
                                                {Page_Name.toUpperCase().match("LOGIN") && (
                                                    <span>Register</span>
                                                )}
                                                {Page_Name.toUpperCase().match("REGISTER") && (
                                                    <span>Login</span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );

    if (localStorage.getItem('userID') != null) {
        return (<MainPage />);
    } else {
        return (login_Registo);
    }

}

export default LoginComponent;