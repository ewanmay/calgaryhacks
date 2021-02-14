import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/context';
import { AuthState } from '../../context/types';
import { nameValidation } from '../../utils/inputUtils';
import './Auth.css';

function Auth() {
  const [state, dispatch] = useContext(AppContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState([] as string[])

  useEffect(() => {
    state.socket.on('login-response', (login: AuthState) => {
      dispatch({ type: "LOGIN", payload: login })
    })
  }, [])

  const logIn = () => {
    const usernameError = nameValidation("Username", username)
    const passwordError = nameValidation("Password", password)

    if (!usernameError && !passwordError) {
      state.socket.emit("login", { username, password })
    }
    else {
      const allErrors: string[] = [];
      [usernameError, passwordError].forEach((error: string | null) => {
        if (error && error.length > 0) {
          allErrors.push(error)
        }
      })
      setErrorMessage(allErrors)
    }
  }


  return (
    <div className="col-12 p-0 fill flex center" onKeyPress ={(e) => { if (e.key === "Enter") { logIn() } }}>
      <div className="col-4 p-0 flex center">
        <h3>Welcome to Games Night</h3>
        <div className="error-message col-12">
          {state.authState.errorMessage}
          {errorMessage.map((error: string) => (
            <div className="col-12 p-0 error-message">
              {error}
            </div>))
          }
        </div>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Username"
            className="col-12"
            aria-label="Username"
            aria-describedby="basic-addon1"
            onChange={(value: ChangeEvent<any>) => setUsername(value.target.value)}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Password"
            aria-label="Password"
            aria-describedby="basic-addon2"
            type='password'
            onChange={(value: ChangeEvent<any>) => setPassword(value.target.value)}
          />
        </InputGroup>

        <Button onClick={() => logIn()}>Log in</Button>
        <div className="col-12" style={{margin: 10}}>
          New here? <Link to="/sign-up"> Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default Auth;
