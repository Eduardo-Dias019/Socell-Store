import React, { useState } from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'

const Register = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleClickRegister = async () => {

    const urlApi = "http://localhost:3001/register";

    await axios.post(urlApi, {
      nome: name,
      email: email,
      password: password,
      confirmpassword: confirmPassword
    }
    ).then((response) => console.log(response)).catch((err) => console.log("Ocorreu um erro!", err))
  }

  return (
    <div>        
      <main className='Register-container'>
        <form className='form-register'>
          <h1>Crie sua conta</h1>
          <span>Já possui uma conta? <Link to='/login'><p>Clique aqui</p></Link> para entrar</span>
          <label>Nome:</label>
          <input className='input-register required' name='userName' type="text" placeholder='Digite seu nome' onChange={(e) => setName(e.target.value)} value={name} />
          <span className="span-required">O nome deve ter no minímo 3 caracteres</span>
          <label>E-mail:</label>
          <input className='input-register required' name='email' type="email" placeholder='Digite seu e-mail' onChange={(e) => setEmail(e.target.value)} value={email} />
          <span className="span-required">Digite uma e-mail válido</span>
          <label>Senha:</label>
          <input className='input-register required' name='password' type="text" placeholder='Crie uma senha' onChange={(e) => setPassword(e.target.value)} value={password} />
          <span className="span-required">A senha deve conter no minímo 8 caracteres</span>
          <label>Repita a senha:</label>
          <input className='input-register required' type="text" placeholder='Repita a senha' onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword}/>
          <span className="span-required">As senhas devem ser iguais</span>
          <button className='submmit-button' onClick={() => handleClickRegister}> Criar conta</button>
        </form>
     </main>
    </div>
  )
}

export default Register