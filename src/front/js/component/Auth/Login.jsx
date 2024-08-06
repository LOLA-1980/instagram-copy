import React, { useContext, useState } from 'react'
import { Context } from '../../store/appContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { actions, store } = useContext(Context);
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();
        const success = await actions.login(username, password);
        if (success) {
            navigate('/create-post');
        } else {
            alert("Credenciales inválidas");
        }
    };


    return (
        <div className='container'>
            <form className='d-flex justify-content-center mt-4 row' onSubmit={handleLogin}>
                <div className='col-md-6'>
                    <h2 className='text-center text_blue fw-bold'>Login</h2>
                    <div className="col-md-12 mb-3">
                        <label htmlFor="exampleInputUsername" className="form-label text_blue fw-bold">User Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="exampleInputUsername"
                            placeholder="User Name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                       
                    </div>
                    <div className="col-md-12 mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label text_blue fw-bold">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="exampleInputPassword1"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="col-md-12 btn btn-primary">Login</button>
                </div>
            </form>
        </div>
    )
}

export default Login