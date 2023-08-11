import React,{useEffect, useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alert } from '../functions';

const CREATE = 1;
const EDIT = 2;
const ALERT_TYPE_SUCCESS = 'success';

const ShowProducts = () => {
    const urlEndPoint = '';
    const url='http://127.0.0.1:8000/api/v1/questions/';
    const [questions,setQuestions]= useState([]);
    const [id,setId]= useState('');
    const [question_text,setQuestionText]= useState('');
    const [pub_date,setPubDate]= useState('');
    const [operation,setOperation]= useState(CREATE);
    const [title,setTitle]= useState('');

    useEffect(() => {
        getQuestions();
    },[]);

    const getQuestions = async () => {
        const response = await axios.get(url);
        setQuestions(response.data['results']);
    }
    const openModal = (user_action,id, question_text, pub_date) =>{
        setId('');
        setQuestionText('');
        setPubDate('');
        setOperation(user_action);
        if(user_action === CREATE){
            setTitle('Registrar Pregunta');
        }
        else if(user_action === EDIT){
            setTitle('Editar Pregunta');
            setId(id);
            setQuestionText(question_text);
            setPubDate(pub_date);
        }

        window.setTimeout(function(){
            document.getElementById('question').focus();
        }, 500);
    }
    const validar = () => {
        var payload;
        var http_method;
        if (question_text.trim() === ''){
            show_alert('Escribe el nombre de la pregunta','warning');
        }
        else if (pub_date === '') {
            show_alert('Escribe la fecha de publicacion','warning');
        }
        else {
            if (operation === CREATE){
                payload = {
                    question_text: question_text.trim(),
                    pub_date: pub_date
                };
                http_method = 'POST';
            }
            else {
                payload = {
                    id: id,
                    question_text: question_text.trim(),
                    pub_date: pub_date
                };
                http_method = 'PUT';
            }

            makeRequest(http_method, payload);
        }
    }
    const makeRequest = async(http_method, payload) => {
        if (http_method == 'DELETE'){
            urlEndPoint = `${url}${payload.id}/`;
        } else {
            urlEndPoint = url;
        }
        
        await axios({ method: http_method, url: urlEndPoint, data: payload }).then(function(response){
            var alertType = response.data[0];
            var message = response.data[1];
            show_alert(message, alertType);
            if(alertType === ALERT_TYPE_SUCCESS){
                document.getElementById('btnCerrar').click();
                getQuestions();
            }
        })
        .catch(function(error){
            show_alert('Error en la solicitud','error');
            console.log(error);
        });
    }
    const deleteQuestion= (id, question_text) =>{
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title:`¿Seguro de eliminar la pregunta ${question_text}?`,
            icon: 'question',
            text: 'No se podrá dar marcha atrás',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText:'Cancelar'
        }).then((result) =>{
            if(result.isConfirmed){
                setId(id);
                makeRequest('DELETE',{id: id});
            }
            else{
                show_alert('La pregunta NO fue eliminado','info');
            }
        });
    }

  return (
    <div className='App'>
        <div className='container-fluid'>
            <div className='row mt-3'>
                <div className='col-md-4 offset-md-4'>
                    <div className='d-grid mx-auto'>
                        <button onClick={()=> openModal(CREATE)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                            <i className='fa-solid fa-circle-plus'></i> Añadir
                        </button>
                    </div>
                </div>
            </div>
            <div className='row mt-3'>
                <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                    <div className='table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <tr><th>#</th><th>PREGUNTA</th><th>PUBLICACION</th></tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {questions.map( (question,i)=>(
                                    <tr key={question.id}>
                                        <td>{(i+1)}</td>
                                        <td>{question.question_text}</td>
                                        <td>{question.pub_date}</td>
                                        <td>
                                            <button onClick={() => openModal(EDIT,question.id,question.question_text,question.pub_date)}
                                                 className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                                <i className='fa-solid fa-edit'></i>
                                            </button>
                                            &nbsp; 
                                            <button onClick={()=>deleteQuestion(question.id,question.question_text)} className='btn btn-danger'>
                                                <i className='fa-solid fa-trash'></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div id='modalProducts' className='modal fade' aria-hidden='true'>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <label className='h5'>{title}</label>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                    </div>
                    <div className='modal-body'>
                        <input type='hidden' id='id'></input>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                            <input type='text' id='question' className='form-control' placeholder='Pregunta' value={question_text}
                            onChange={(e)=> setQuestionText(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                            <input type='datetime-local' id='pub_date' className='form-control' placeholder='Fecha de publicación' value={pub_date}
                            onChange={(e)=> setPubDate(e.target.value)}></input>
                        </div>
                        <div className='d-grid col-6 mx-auto'>
                            <button onClick={() => validar()} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk'></i> Guardar
                            </button>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ShowProducts