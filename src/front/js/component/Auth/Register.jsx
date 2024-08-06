import React, { useContext, useState } from 'react'
import { Context } from '../../store/appContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { actions, store } = useContext(Context);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    await actions.register(avatar, name, surname, username, password);
    navigate('/login');
  };


  return (
    <div>
      <form className="container d-flex justify-content-center vh-100" onSubmit={handleSignup}>
        <div className='col-md-6'>
          <h2 className='text-center text_blue fw-bold mt-3'>Crear Cuenta</h2>
          <div className="col-md-12">
            <label htmlFor="inputAvatar" className="form-label text_blue fw-bold">Avatar</label>
            <input
              type="text"
              className="form-control"
              id="inputAvatar"
              placeholder="Avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label text_blue fw-bold">Nombre</label>
            <input
              type="text"
              className="form-control"
              id="inputName"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputSurename" className="form-label text_blue fw-bold">Surname</label>
            <input
              type="text"
              className="form-control"
              id="inputSurename"
              placeholder="Surename"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
          </div>
          <div className="col-md-12">
            <label htmlFor="inputUsername" className="form-label text_blue fw-bold">User Name</label>
            <input
              type="text"
              className="form-control"
              id="inputUsername"
              placeholder="User Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="col-md-12">
            <label htmlFor="inputPassword" className="form-label text_blue fw-bold">Password</label>
            <input
              type="password"
              className="form-control"
              id="inputPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="col-md-12 btn btn-primary mt-5">Registrarse</button>
        </div>
      </form>
    </div>
  );
};

export default Register