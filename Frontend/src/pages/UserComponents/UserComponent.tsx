import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import "../../styles/pages/Login.css";

var API_URL = "http://localhost:8080"

function getUserName() : string {
    return localStorage.getItem("Username") || "User xpto";
}

function deleteLocalStorage(){
    var items = ["Username", "userID"];
    items.forEach(element => {
        localStorage.removeItem(element);
    });
}

function User() {
    const navigate = useNavigate();
    
    const Logout =  async() => {
        try{
            await axios
                .put(API_URL+ "/user/authentication/logout/" + localStorage.getItem("userID"))
                .then((response: any) =>{
                    deleteLocalStorage();
                    navigate("/");
                })

        }catch(error){
            console.log(error);
            deleteLocalStorage();
            navigate("/");
        }
    }

    const changeUser = () => {
        navigate("/ChangeUserConfigs");
    }

    return (
        <div className="" style={{marginTop: '10px'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center'}}>
                <h5 style={{textAlign:  'center'}}>Olá</h5>
                <h3 style={{textAlign:  'center'}}>{ getUserName() }</h3>
                <button type="button" className="btn btn-primary" onClick={ changeUser } style={{ textAlign: 'center', marginTop: '20px'}}>
                    Alterar dados da conta
                </button>
                <button type="button" className="btn btn-primary" onClick={ Logout } style={{backgroundColor: 'red', border: '1px solid red', textAlign: 'center', marginTop: '10px'}}>
                    Log out
                </button>
            </div>
        </div>
    
    );
}

export default User;