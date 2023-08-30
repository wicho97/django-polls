import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import CustomHeader from './components/Header'

import PrivateRoute from './utils/PrivateRoute'

import { Layout, Menu, theme } from 'antd';

const { Header, Content, Footer } = Layout;


function App() {

    let { user, logoutUser } = useContext(AuthContext)

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const navigation = [
        { label: "Inicio", key: "/" },
        { label: "Login", key: "/login" },
    ];

    const navigate = useNavigate();

    const handleMenuClick = ({ key }) => {
        if (key) {
          navigate(key);
        }
    };

    return (
        <AuthProvider>
            <div className="App">
                <Layout className="layout">
                    <Header style={{ 
                        alignItems: 'center' }}>
                            <Menu
                                theme="dark"
                                mode="horizontal"
                                items={navigation}
                                onClick={handleMenuClick}
                            />
                    </Header>
                    <Content style={{ padding: '0 50px' }}>
                        <div style={{ margin: '32px 0', padding: 24, minHeight: 380, background: colorBgContainer }}> 
                                {/* <CustomHeader/> */}
                                <Routes>
                                    <Route path="/" element={
                                        <PrivateRoute>
                                            <HomePage/>
                                        </PrivateRoute>}/>
                                    <Route path="/login" element={<LoginPage/>}/>
                                </Routes>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
                </Layout>
            </div>
        </AuthProvider>
    );
}

export default App;