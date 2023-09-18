import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Input, DatePicker, Button, Modal, Space, Table, Form } from 'antd';
import dayjs from 'dayjs';

const CREATE = 1;
const EDIT = 2;
// const ALERT_TYPE_SUCCESS = 'success';

const HomePage = () => {
    let urlEndPoint = '';
    const { authTokens } = useContext(AuthContext);
    let [questions, setQuestions] = useState([]);
    const [id,setId]= useState('');
    const [question_text,setQuestionText]= useState('');
    const [pub_date,setPubDate]= useState('');
    const [operation,setOperation]= useState(CREATE);
    const [modal_title,setModalTitle]= useState('');
    const [sub_modal_title,setSubModalTitle]= useState('');
    const [choice_id,setChoiceId] = useState('');
    const [choice_text,setChoiceText]= useState('');

    let [total_questions, setTotalQuestions] = useState(1);
    let [question, setQuestion] = useState([]);

    const CONFIG = {
        headers:{
            'Content-Type': 'application/json',
            'Authorization':'Bearer ' + String(authTokens.access)
        }
      };
    
    const END_POINT = "http://127.0.0.1:8000/api/v1/questions/";

    useEffect(() => {
        getQuestions(1,10);
    },[])

    const getQuestions = async(page, page_size) => {
        let response = await axios.get(`${END_POINT}?page=${page}&page_size=${page_size}`, CONFIG)
        // console.log(`${END_POINT}?page=${page}&page_size=${page_size}`)
        if(response.status === 200){
            setQuestions(response.data.results)
            setTotalQuestions(response.data.count)
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

    const validarChoice = (question) => {
        console.log(question);
        var payload;
        var http_method;
        
        if (choice_text.trim() === ''){
            console.log('Escribe el nombre de la opción','warning');
        }
        else {
            if (operation === CREATE){
                payload = {
                    question: question.pk,
                    choice_text: choice_text.trim(),
                };
                http_method = 'POST';
            }
            else {
                payload = {
                    choice_id: choice_id,
                    choice_text: choice_text.trim(),
                };
                http_method = 'PATCH';
            }

            makeRequestChoices(http_method,question.pk, payload);
        }
    }

    const setCustomPubDate = (pub_date) => {
        console.log(pub_date);
        if (pub_date == null) {
            setPubDate(dayjs());
        } else {
            setPubDate(pub_date);
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
            if (http_method == 'DELETE') {
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
                getQuestions(1,10);
            } else {
                getQuestions(1,10);
            }
        })
        .catch(function(error){
            // show_alert('Error en la solicitud','error');
            console.log(error);
        });
    }

    const makeRequestChoices = async(http_method, id, payload) => {
        console.log(payload);
        if (http_method == 'DELETE' || http_method == 'PATCH'){
            urlEndPoint = `${END_POINT}${id}/choices/${payload.choice_id}/`;
        } else {
            urlEndPoint = `${END_POINT}${id}/choices/`;
        }
        await axios({
            method: http_method,
            url: urlEndPoint,
            data: payload,
            headers:{
                'Content-Type': 'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        }).then(async function(response){
            if (http_method == 'DELETE') {
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
                question = await getQuestion(id)
                setQuestion(question)
            } else {
                question =  await getQuestion(id)
                setQuestion(question)
            }
        })
        .catch(function(error){
            // show_alert('Error en la solicitud','error');
            console.log(error);
        });
    }

    const getQuestion = async(question_id) => {
        let response = await axios.get(`${END_POINT}${question_id}/`, CONFIG)
        // setQuestion(response.data)
        return response.data
    }

    const deleteQuestion= (id, question_text) =>{
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: `¿Seguro de eliminar la pregunta ${question_text}?`,
            text: "No se podrá dar marcha atrás",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText:'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setId(id);
                makeRequest('DELETE',{id: id});
            } else {
                Swal.fire('La pregunta no fue eliminada', '', 'info')
            }
        });
    }

    const deleteChoice= (id, choice_id, choice_text) =>{
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: `¿Seguro de eliminar la opción ${choice_text}?`,
            text: "No se podrá dar marcha atrás",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText:'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setId(id);
                makeRequestChoices('DELETE',{id: id, choice_id:choice_id});
            } else {
                Swal.fire('La opción no fue eliminada', '', 'info')
            }
        });
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalVoteOpen, setIsModalVoteOpen] = useState(false);
    const [isModalChoiceOpen, setIsModalChoiceOpen] = useState(false);

    const showModal = (user_action,question) => {
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
            console.log(question);
            setId(question.pk);
            setQuestionText(question.question_text);
            setPubDate(question.pub_date);
            setQuestion(question);
        }
    };

    const showModalVote =  async(question_id) => {
        setIsModalVoteOpen(true);
        console.log('Antes de getQuestion');
        console.log(setQuestion(await getQuestion(question_id)));
        console.log('Despues de getQuestion');
    };

    const handleOk = () => {
        validar();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleVoteOk = () => {
        setIsModalVoteOpen(false);
    };

    const handleVoteCancel = () => {
        setIsModalVoteOpen(false);
    };

    const showModalChoice = (user_action,choice) => {
        setIsModalChoiceOpen(true);

        console.log('showModalChoice choice: ',choice)

        setOperation(user_action);
        if(user_action === CREATE){
            setId('');
            setChoiceId('');
            setChoiceText('');
            setSubModalTitle('Registrar Opción');
        }
        else if(user_action === EDIT){
            setSubModalTitle('Editar Opción');
            setId(choice.question_id);
            setChoiceId(choice.pk);
            setChoiceText(choice.choice_text);
        }
      };
    
      const handleChoiceOk = (question) => {
        validarChoice(question);
      };
    
      const handleChoiceCancel = () => {
        setIsModalChoiceOpen(false);
      };

    const dataSource = [
        questions.map( (question,i)=>(
            {
                key: i + 1,
                pk: question.id,
                question_text: question.question_text,
                pub_date: question.pub_date,
                choices: question.choices,
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
                    <Button type="primary" onClick={()=>showModal(EDIT, record)}>
                        Editar
                    </Button>
                    &nbsp;
                    <Button type="primary" onClick={()=>deleteQuestion(record.pk, record.question_text, record.pub_date)}>
                        Borrar
                    </Button>
                    &nbsp;
                    <Button type="primary" onClick={()=>showModalVote(record.pk)}>
                        Votar    
                    </Button>
                </Space>
              ),
          },
    ];

    const choiceDataSource = [
        question && question.choices && question.choices.map( (choice, i)=>(
            {
                key: i + 1,
                pk: choice.id,
                choice_text: choice.choice_text,
                votes: choice.votes,
                question_id: question.pk,
            }
        ))
      ];
      
    const choiceColumns = [
        {
          title: 'ID',
          dataIndex: 'pk',
          key: 'pk',
        },
        {
          title: 'Opción',
          dataIndex: 'choice_text',
          key: 'choice_text',
        },
        {
          title: 'Votes',
          dataIndex: 'votes',
          key: 'votes',
        },
        {
            title: 'Acciones',
            dataIndex: 'acciones',
            key: 'acciones',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={()=>showModalChoice(EDIT, record)}>
                        Editar
                    </Button>
                    &nbsp;                
                    <Button type="primary" onClick={()=>deleteChoice(record.question_id,record.pk, record.choice_text)}>
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
                            <Table
                                dataSource={dataSource[0]}
                                columns={columns}
                                pagination={{
                                    total: total_questions,
                                    onChange: (page, page_size) => {
                                        getQuestions(page, page_size)
                                    },
                                }} />
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                title={modal_title}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel} >
                <Input
                    placeholder="Escriba una pregunta"
                    value={ question_text }
                    onChange={(e)=> setQuestionText(e.target.value)} />
                <DatePicker
                    showTime
                    value={ dayjs(pub_date) }
                    onChange={date => setCustomPubDate(date)} />
                {/* { console.log(id) } */}
                <Button key="back" onClick={handleCancel}>
                    Cancelar
                </Button>
                <Button key="submit" type="primary" onClick={handleOk}>
                    Guardar
                </Button>
                { console.log('Question en tabla: ',question) }
                { console.log('Choice dataSource: ',choiceDataSource[0]) }
                {   (question.pk || question.id) ? 
                    <>
                    <Table 
                        dataSource={choiceDataSource[0]} 
                        columns={choiceColumns}
                        pagination={false} />
                        <Button type="primary" onClick={() =>showModalChoice(CREATE,  question)}>
                            Añadir Opción
                        </Button>
                        </>
                    :
                    null
                }
                
            </Modal>
            <Modal
                title='Opciones'
                open={isModalVoteOpen}
                onOk={handleVoteOk}
                onCancel={handleVoteCancel}
                footer={[
                    <Button key="back" onClick={handleVoteCancel}>
                        Cancelar
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleVoteOk}>
                        Votar
                    </Button>,
                ]}>
                    { question && question.choices &&
                        question.choices.map( (choice)=>(
                            <p>{ choice.id } - { choice.choice_text }</p>
                        ))
                    }
            </Modal>
            <Modal 
                title={sub_modal_title}
                open={isModalChoiceOpen}
                onOk={() => handleChoiceOk(question)}
                onCancel={handleChoiceCancel}>
                <Input
                    placeholder="Escriba una opción"
                    value={ choice_text }
                    onChange={(e)=> setChoiceText(e.target.value)} />
            </Modal>
        </div>
    )
}

export default HomePage