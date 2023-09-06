import { createContext, useState, useEffect } from 'react'
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

// export default AuthContext;

export const AuthProvider = ({children}) => {

    let [user, setUser] = useState(() => (localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null))
    let [authTokens, setAuthTokens] = useState(() => (localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null))
    let [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    let loginUser = async (payload) => {
        const response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: payload.username, password: payload.password })
        });
        console.log("Despues del response");
        console.log(response);
        let data = await response.json();
        
        if(data && response.status == 200){
            localStorage.setItem('authTokens', JSON.stringify(data));
            setAuthTokens(data)
            console.log('Setting access token', data)
            setUser(jwtDecode(data.access))
            navigate('/')
        } else {
            alert('Something went wrong while logging in the user!')
        }
    }

    let logoutUser = () => {
        localStorage.removeItem('authTokens')
        setAuthTokens(null)
        setUser(null)
        navigate('/login')
    }

    const updateToken = async () => {
        const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({ refresh: authTokens?.refresh })
        })
       
        const data = await response.json()
        if (response.status === 200) {
            if (localStorage.getItem('authTokens')) {
                // Estamos actualizando el access token y el refresh token se mantiene igual
                let newAuthTokens = JSON.parse(localStorage.getItem('authTokens'));
                newAuthTokens.access = data.access;
                console.log('newAuthTokens: ', newAuthTokens.access);

                setAuthTokens(newAuthTokens);
                setUser(jwtDecode(data.access));
                localStorage.setItem('authTokens',JSON.stringify(newAuthTokens));
            }
        } else {
            logoutUser()
        }

        if(loading){
            setLoading(false)
        }
    }

    let contextData = {
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser,
    }

    useEffect(()=>{
        const REFRESH_INTERVAL = 1000 * 60 * 4 // 4 minutes
        console.log('Llamando useEffect')
        let interval = setInterval(()=>{
            if(authTokens){
                console.log('Actualizando token');
                updateToken()
            }
        }, REFRESH_INTERVAL)
        // Fase de limpieza
        return () => {
            console.log("Fase de limpieza")
            clearInterval(interval)
        }

    },[authTokens])

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}