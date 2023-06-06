import { useLocation } from "react-router-dom";
import React, {Component} from "react";
import ReactDOM from 'react-dom';
import { saveAs } from 'file-saver';
import axios from "axios";
import { Guid } from 'js-guid';

import "../../";
import "../../styles/pages/Login.css";

var API_URL = "http://localhost:8080"

interface DocumentTextAreaState {
    DocumentText: string;
}

class DocumentEditor extends Component<{}, DocumentTextAreaState> {
    constructor(props : any) {
        super(props);

        this.state = {
            DocumentText: ""
        };
    }


    handleExport = async (type: string) => {
        var txtFile = new File([this.state.DocumentText.toString()], (Guid.newGuid() + ".txt"), {type: "text/plain;charset=utf-8"});
        
        const formData = new FormData();
        formData.append("file", txtFile);

        var citeStyle = document.getElementById("citeStyles") as any;
        

        try {
            await axios
                .post(API_URL + "/document/" + localStorage.getItem('userID'), formData,
                { params:
                    {
                        style: citeStyle.value,
                        docType: type
                    }
                },
                { headers:
                    {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then((response: any) => {
                    debugger
                    if (type == "HTML"){
                        saveAs(new Blob([response.data], { type: 'text/html;charset=utf-8' }), "Document.html");
                    }else if (type == "TXT"){
                        saveAs(new Blob([response.data], { type: 'text/plain;charset=utf-8' }), "Document.txt");
                    }
                })

        } catch (error) {
            console.log(error);
        }
    }

    handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ DocumentText: event.target.value });
    };

    handleClear = () => {
        this.setState({ DocumentText: "" });
    };


    render() {
        return (
            <div style={{marginTop: '10px'}}>
                <h5>Documento:</h5>
                <textarea name="Texto" rows={25} cols={100}
                    value={this.state.DocumentText}
                    onChange={this.handleChange}
                />
    
                <div>

                    <button type="button" className="btn btn-primary" onClick={ this.handleClear } >
                        Limpar Texto
                    </button>

                    <button type="button" className="btn btn-primary" onClick={ e => this.handleExport("HTML") } >
                        Exportar Para HTML
                    </button>

                    <button type="button" className="btn btn-primary" onClick={ e => this.handleExport("TXT") } >
                        Exportar Para TXT
                    </button>

                    <select name="citeStyles" id="citeStyles">
                        <option value="APA">APA</option>
                        <option value="IEEE">IEEE</option>
                        <option value="Chicago">Chicago</option>
                        <option value="Mla">Mla</option>
                    </select>
    
                </div>
    
            </div>
        );
    }
}



export default DocumentEditor;