import { useLocation, useNavigate } from "react-router-dom";
import "../";
import "../styles/pages/Login.css";

//Components
import ReferenceList from "./MainPageComponents/ReferenceListComponent";
import User from "./UserComponents/UserComponent";
import DocumentEditor from "./MainPageComponents/DocumentEditorComponent";



function checkLogin() {
    return true;
    if (localStorage.getItem("userID") != null){
        return true;
    }
    return false;
}


function MainPage(){

    const goToLogin = () => {
        navigate("/login");
    }

    const navigate = useNavigate();

    if (checkLogin() === true){
        return (
            <div className="container align-items-center" style={{ maxWidth: "75%" }}>
                <div className="row">
                    <div className="col div1">
                        <User/>
                    </div>
    
                    <div className="col div2">
                        <DocumentEditor/>
                    </div>

                    <div className="col div3">
                        <ReferenceList/>
                    </div>
                </div>
            </div>
        
        );
    }else{
        return (
            <div>
                <h1>Não tem sessão iniciada</h1>
                <button onClick={goToLogin}>Ir para Login</button>
            </div>
        );
    }
}

export default MainPage;