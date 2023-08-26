import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Input, DatePicker, Button, Modal, Space, Table } from 'antd';
import dayjs from 'dayjs';

const CREATE = 1;
const EDIT = 2;
// const ALERT_TYPE_SUCCESS = 'success';

const HomePage = () => {
    let urlEndPoint = '';
    const { authTokens } = useContext(AuthContext);
    let [questions, setQuestions] = useState([])
    const [id,setId]= useState('');
    const [question_text,setQuestionText]= useState('');
    const [pub_date,setPubDate]= useState('');
    const [operation,setOperation]= useState(CREATE);
    const [modal_title,setModalTitle]= useState('');

    const CONFIG = {
        headers:{
            'Content-Type': 'application/json',
            'Authorization':'Bearer ' + String(authTokens.access)
        }
      };
    
    const END_POINT = "http://127.0.0.1:8000/api/v1/questions/";

    useEffect(() => {
        getQuestions()
    },[])

    const getQuestions = async() => {
        let response = await axios.get(END_POINT, CONFIG)
        if(response.status === 200){
            setQuestions(response.data.results)
        }
    }

    const validar = () => {
        var payload;
        var http_method;
        if (question_text.trim() === ''){
            console.log('Escribe el nombre de la pregunta','warning');
        }
        else if (pub_date === '') {
            console.log('Escribe la fecha de publicacion','warning');
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
                http_method = 'PATCH';
            }

            makeRequest(http_method, payload);
        }
    }

    const makeRequest = async(http_method, payload) => {
        if (http_method == 'DELETE' || http_method == 'PATCH'){
            urlEndPoint = `${END_POINT}${payload.id}/`;
        } else {
            urlEndPoint = END_POINT;
        }
        await axios({
            method: http_method,
            url: urlEndPoint,
            data: payload,
            headers:{
                'Content-Type': 'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        }).then(function(response){
            // var alertType = response.data[0];
            // var message = response.data[1];
            // console.log(response.data);
            // console.log(alertType);
            // console.log(message);
            // show_alert(message, alertType);
            // if(alertType === ALERT_TYPE_SUCCESS){
            //     document.getElementById('btnCerrar').click();
            //     getQuestions();
            // }
            getQuestions();
        })
        .catch(function(error){
            // show_alert('Error en la solicitud','error');
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
            // else{
            //     show_alert('La pregunta NO fue eliminado','info');
            // }
        });
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = (user_action,id, question_text, pub_date) => {
        setIsModalOpen(true);

        setId('');
        setQuestionText('');
        setPubDate(dayjs());
        setOperation(user_action);
        if(user_action === CREATE){
            setModalTitle('Registrar Pregunta');
        }
        else if(user_action === EDIT){
            setModalTitle('Editar Pregunta');
            setId(id);
            setQuestionText(question_text);
            setPubDate(pub_date);
        }
    };

    const handleOk = () => {
        // setIsModalOpen(false);
        validar();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const setCustomPubDate = (pub_date) => {
        console.log(pub_date);
        if (pub_date == null) {
            setPubDate(dayjs());
        } else {
            setPubDate(pub_date);
        }
    }

    const dataSource = [
        questions.map( (question,i)=>(
            {
                key: i + 1,
                pk: question.id,
                question_text: question.question_text,
                pub_date: question.pub_date,
            }
        ))
      ];
      
      const columns = [
        {
          title: 'ID',
          dataIndex: 'pk',
          key: 'pk',
        },
        {
          title: 'Pregunta',
          dataIndex: 'question_text',
          key: 'question_text',
        },
        {
          title: 'Fecha de publicacion',
          dataIndex: 'pub_date',
          key: 'pub_date',
        },
        {
            title: 'Acciones',
            dataIndex: 'acciones',
            key: 'acciones',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={()=>showModal(EDIT, record.pk, record.question_text, record.pub_date)}>
                        Editar
                    </Button>
                    &nbsp; 
                    <Button type="primary" onClick={()=>deleteQuestion(record.pk, record.question_text, record.pub_date)}>
                        Borrar
                    </Button>
                </Space>
              ),
          },
      ];

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-md-4'>
                        <div className='d-grid mx-auto'>
                            <Button type="primary" onClick={()=>showModal(CREATE)}>
                                Añadir
                            </Button>
                        </div>
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                        <div className='table-responsive'>
                            <Table dataSource={dataSource[0]} columns={columns} />;
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                title={modal_title}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                      Cancelar
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                      Guardar
                    </Button>,
                  ]}>
                <Input
                    placeholder="Escriba una pregunta"
                    value={ question_text }
                    onChange={(e)=> setQuestionText(e.target.value)} />
                <DatePicker
                    showTime
                    value={ dayjs(pub_date) }
                    onChange={date => setCustomPubDate(date)} />
            </Modal>
        </div>
    )
}

export default HomePage