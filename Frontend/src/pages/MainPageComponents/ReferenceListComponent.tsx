import { useLocation, useNavigate } from "react-router-dom";
import { flushSync } from 'react-dom';
import Select from 'react-select'
import "../../";
import "../../styles/pages/Login.css";
import "../../styles/pages/ReferenceModal.css"
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { ReferenceModel } from "../../Models/ReferenceModels";
import { saveAs } from "file-saver";

var API_URL = "http://localhost:8080";
var references = new Array<ReferenceModel>();
var ReferenciaSelecionada : any;
var lastStylesChange: Array<string>;
var tipoReferencia: string;


const Tipos_Referencias = [
    { value: 'Article', label: 'Artigo' },
    { value: 'Book', label: 'Livro' },
    { value: 'Generic', label: 'Genérico' },
    { value: 'Journal', label: 'Jornal' },
    { value: 'Magazine', label: 'Revista' },
    { value: 'Website', label: 'Website' },
];

function getType(type: string): string[] {
    if (type === "Article"){
        return ["author","title","year","month","day","year_access","month_access","day_access","pages"];
    }else if (type === "Book"){
        return ["author","title","year","month","day","year_access","month_access","day_access","publisher","pages"];
    }else if (type === "Generic"){
        return ["author","title","year","month","day","year_access","month_access","day_access"];
    }else if (type === "Journal"){
        return ["author","title","year","month","day","year_access","month_access","day_access","publisher","name_journal","pages"];
    }else if (type === "Magazine"){
        return ["author","title","year","month","day","year_access","month_access","day_access","publisher","name_magazine","pages"];
    }else if (type === "Website"){
        return ["author","title","year","month","day","year_access","month_access","day_access","url"];
    }

    return [];
}

function changeCSS (property: string, value: string){
    var x = document.getElementsByClassName(property) as HTMLCollectionOf<HTMLElement>;
    if (x !== undefined && x.length > 0){
        x[0].style.display = value;
    }
}

function getValueWithId(property: string): string | number{
    var x = document.getElementById(property) as any;
    switch(property){
        case "input_author":
        case "input_title":
        case "input_publisher":
        case "input_name_journal":
        case "input_name_magazine":
        case "input_url":
            if(x.value.length === 0){
                throw new Error(`${property} is empty!`);
            }
            
            var url = x.value as string;
            if (!url.includes("http") && property == "input_url"){
                x.value = "http://" + x.value;
            }

            break;
        case "input_year":
        case "input_year_access":
            if(Number(x.value) < 0){
                throw new Error(`${property} is invalid!`);
            }
            break;
        case "input_month":
        case "input_month_access":
            if(Number(x.value) < 0 || Number(x.value) > 12){
                throw new Error(`${property} is invalid!`);
            }
            break;
        case "input_day":
        case "input_day_access":
            if(Number(x.value) < 0 || Number(x.value) > 31){
                throw new Error(`${property} is invalid!`);
            }
            break;
        case "input_pages":
            if(Number(x.value) < 0){
                throw new Error(`${property} is invalid!`);
            }
            break;                                 
    }
    return x.value;
}

function ReferenceList() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [ showModal, setShowModal ] = useState(false);
    const [ referencesLoaded, loadedReferences ] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        loadReferences();
    }, []);

    useEffect(() => {
        if (ReferenciaSelecionada != undefined){
            changeTipoReference({ value: ReferenciaSelecionada.type, label: ReferenciaSelecionada.type });
            getType(ReferenciaSelecionada.type).forEach(e => {
                (document.getElementById("input_" + e) as any).value = ReferenciaSelecionada[e];
            })
        }else{
            setSelectedOption(null);
        }

        if (showModal == false){
            loadReferences();
        }
    }, [showModal]);
      
    var loadReferences = useCallback(async () => {
        try{
            await axios
            .get(API_URL+ "/reference/" + localStorage.getItem("userID"))
            .then((response: any) =>{
                references = response.data as ReferenceModel[];
                handleLoadedReferences(true);
            })

        }catch(error){
            console.log(error)
        }
    },[]);

    useEffect(() => {
        loadReferences();
      }, [loadReferences]);

    const changeTipoReference = (selectedOption: any) => {
        if (selectedOption !== undefined){
            tipoReferencia = selectedOption.value;
            if (lastStylesChange !== undefined){
                lastStylesChange.forEach(e => changeCSS(e, ""));
            }
            setSelectedOption(selectedOption);
            
            var x = selectedOption.value;
            lastStylesChange = getType(x);
            getType(x)?.forEach(e => changeCSS(e, "block"));
        }
    }

    const handleLoadedReferences = (x: boolean) => {
        loadedReferences(x);
    }

    const handleShowFileModal = () => {
        fileInputRef.current?.click();
    }

    const handleShowModal = () => {
        setShowModal(true);
        handleLoadedReferences(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        if (ReferenciaSelecionada !== undefined){ ReferenciaSelecionada = undefined; }
    };

    const openReference = (idInput: any) => {
        ReferenciaSelecionada = references.find(e => e.id === idInput) as ReferenceModel;
        handleShowModal();
    }

    const APIDeleteReference = async () => {
        var ref = ReferenciaSelecionada as ReferenceModel;

        //API apaga referencia
        try{
            await axios
                .delete(API_URL+ "/reference/" + localStorage.getItem('userID') + "/" + ref.id )
                .then((response: any) => {
                    console.log(response);
                    handleCloseModal();
                });

        }catch(error){
            return;
        }
    }

    const handleExportReferences = async () => {
        var typeOfDocument = (document.getElementById("ExportImportTypes") as any).value;
        debugger
        try{
            await axios
                .get(API_URL+ "/reference/export/" + localStorage.getItem('userID'), 
                { params:
                    {
                        docType: typeOfDocument
                    }
                }, )
                .then((response: any) => {
                    saveAs(new Blob([response.data], {type: "octet/stream"}), ("Export" + typeOfDocument + "." + typeOfDocument));
                    handleCloseModal();
                });

        }catch(error){
            console.log(error);
            return;
        }
    } 

    const APIChangeReference = async () => {
        var ref = {} as any;

        getType(tipoReferencia).forEach(e => {
            if (typeof e === 'string'){
                ref[e as keyof ReferenceModel] = getValueWithId("input_"+e);
            }else{
                ref[e as keyof ReferenceModel] = Number(getValueWithId("input_"+e));
            }
        });

        ref.id = (ReferenciaSelecionada as ReferenceModel).id;
        ref.type = (ReferenciaSelecionada as ReferenceModel).type;

        //API altera referencia
        try{
            await axios
                .put(API_URL+ "/reference/" + localStorage.getItem('userID') + "/" + ref.id , ref)
                .then((response: any) => {
                    handleCloseModal();
                });

        }catch(error){
            console.log(error);
            return;
        }
    }

    const uploadFile = async (event: any) => {
        var file = event?.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        var typeOfDocument = (document.getElementById("ExportImportTypes") as any).value;
        debugger

        try{
            await axios
                .post(API_URL+ "/reference/import/" + localStorage.getItem('userID'), formData, 
                { params:
                    {
                        docType: typeOfDocument
                    }
                },
                { headers:
                    {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then((response: any) => {
                    handleCloseModal();
                });

        }catch(error){
            console.log(error);
            return;
        }
    }

    const APIAddReference = async () => {
        var ref = {} as any;

        if (tipoReferencia != null){
            ref.type = tipoReferencia;

            getType(tipoReferencia).forEach(e => {
                if (typeof e === 'string') {
                    ref[e as keyof ReferenceModel] = getValueWithId("input_"+e);
                } else{
                    ref[e as keyof ReferenceModel] = Number(getValueWithId("input_"+e));
                }
            });

            //API cria referencia
            try{
                await axios
                    .post(API_URL+ "/reference/" + localStorage.getItem("userID"), ref)
                    .then((response: any) => {
                        handleCloseModal();
                    });

            }catch(error){
                return;
            }
        }
    }

    return (

    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'start', gap: 2, marginTop: '10px', height: '100%'}}>

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">

                            <div>
                                <Select value={selectedOption} onChange={ changeTipoReference } options={Tipos_Referencias} />
                            </div>
                            <br /><br />
                       
                            <div className="grid-container">

                                <div className="grid-item author">
                                    <label> Autor:</label> 
                                    <input type="text" id="input_author" className="lname" required/>
                                </div>

                                <div className="grid-item title">
                                    <label> Titulo:</label>
                                    <input type="text" id="input_title" className="lname" required/>
                                </div>

                                <div className="grid-item year">
                                    <label> Ano:</label>
                                    <input type="number" id="input_year" className="lname" min="0" required/>
                                </div>

                                <div className="grid-item month">
                                    <label> Mês:</label>
                                    <input type="number" id="input_month" className="lname" min="1" max="12" required/>
                                </div>

                                <div className="grid-item day">
                                    <label> Dia:</label>
                                    <input type="number" id="input_day" className="lname" min="1" max="31" required/>
                                </div>

                                <div className="grid-item year_access">
                                    <label> Ano de acesso:</label>
                                    <input type="number" id="input_year_access" className="lname" min="0" required/>
                                </div>

                                <div className="grid-item month_access">
                                    <label> Mês de acesso:</label>
                                    <input type="number" id="input_month_access" className="lname" min="1" max="12" required/>
                                </div>

                                <div className="grid-item day_access">
                                    <label> Dia de acesso:</label>
                                    <input type="number" id="input_day_access" className="lname" min="1" max="31" required/>
                                </div>

                                <div className="grid-item pages">
                                    <label> Nr de páginas:</label>
                                    <input type="number" id="input_pages" className="lname" min="1" required/>
                                </div>

                                <div className="grid-item publisher">
                                    <label> Editora:</label>
                                    <input type="text" id="input_publisher" className="lname"/>
                                </div>

                                <div className="grid-item name_journal">
                                    <label> Nome do Jornal:</label>
                                    <input type="text" id="input_name_journal" className="lname"/>
                                </div>

                                <div className="grid-item name_magazine">
                                    <label> Nome da revista:</label>
                                    <input type="text" id="input_name_magazine" className="lname"/>
                                </div>

                                <div className="grid-item url">
                                    <label>URL:</label>
                                    <input type="text" id="input_url" className="lname"/>
                                </div>

                                <div id="buttonid">

                                    {ReferenciaSelecionada === undefined && (
                                        <button type="button" className="btn btn-primary" id="btn" onClick={ APIAddReference } >
                                            Adicionar Referência
                                        </button>
                                    )}

                                    {ReferenciaSelecionada !== undefined && (
                                        <div>
                                            <button type="button" className="btn btn-primary" id="btn" onClick={ APIChangeReference } >
                                                Atualizar referência
                                            </button>
                                            <button type="button" className="btn btn-primary" onClick={ APIDeleteReference }  style={{backgroundColor: 'red', border: '1px solid red', textAlign: 'center'}}>
                                                Remover Referência
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <button onClick={handleCloseModal}> Close Modal </button>

                            </div>
                        </div>
                    </div>
                )}

        { referencesLoaded && (
            <div> 
                <h5>Lista referências:</h5>
                <div className="divReferenceList">
                    { references.map(item => (
                        <div key={item.id} onClick={e => openReference(item.id)} style={{display: 'flex', flexDirection:'column', alignItems: 'start', justifyContent: 'center', border: '1px solid #0b5ed7', padding: '5px', borderRadius: '8px', marginTop: '10px'}}>
                            <p key={`title${item.id}`} style={{fontSize: '15px', fontWeight: 500, margin: '0px'}}> {item.title} </p>
                            <p key={`tauthor${item.id}`} style={{fontSize: '12px' , margin: '0px'}}> {item.author} {item.type} </p>
                            <p key={`type${item.id}`} style={{fontSize: '12px', margin: '0px'}}> /cite{item.id} </p>
                            
                        </div>
                        ) 
                    ) }
                </div>
            </div>
            ) 
        }

        <button type="button" className="btn btn-primary" onClick={handleShowModal} style={{textAlign: 'center'}}>
            Adicionar Referência
        </button>
        <div>
            <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={uploadFile} />
            <button type="button" className="btn btn-primary" onClick={handleShowFileModal} style={{textAlign: 'center'}}>
                Importar Referências
            </button>
        </div>


        <button type="button" className="btn btn-primary" onClick={handleExportReferences} style={{textAlign: 'center'}}>
            Exportar Referências
        </button>

        <select name="ExportImportTypes" id="ExportImportTypes">
            <option value="bib">BibText</option>
            <option value="ris">RIS</option>
        </select>
        
        
    </div>
    );
}

export default ReferenceList;