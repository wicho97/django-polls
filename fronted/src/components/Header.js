import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

import { Layout, Menu, theme } from 'antd';

const { Header, Content, Footer } = Layout;

const CustomHeader = () => {
    let { user, logoutUser } = useContext(AuthContext)

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const navigation = [
        { label: "Inicio", key: "/" },
        { label: "Login", key: "/login" },
    ];

    const navigate = useNavigate();

    const handleMenuClick = (data) => {
        if (data.key) {
            navigate(data.key)
        }
        console.log('click', data.key)
    }

    return (
        <Menu
            theme="dark"
            mode="horizontal">
            <Menu.Item onClick={handleMenuClick} key={'/'}>{"Home"}</Menu.Item>
            {user ? (
            <Menu.Item onClick={logoutUser} key={'/logout'}>{"Logout"}</Menu.Item>
            ) : (
            <Menu.Item onClick={handleMenuClick} key={'/login'}>{"Login"}</Menu.Item>
            )}
        </Menu>
        // <div>
        //     <Link to="/">Home</Link>
        //     <span> | </span>
        //     {user ? (
        //         <p onClick={logoutUser}>Logout</p>
        //     ) : (
        //         <Link to="/login" >Login</Link>
        //     )}
        //     {user && <p>Hello {user.username}!</p>}
            
        // </div>
    )
}

export default CustomHeader