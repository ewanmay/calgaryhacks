import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { AppContext } from '../../context/context';
import { AuthState } from '../../context/types';
import { Link, useHistory } from 'react-router-dom';
import { emailValidation, nameValidation } from '../../utils/inputUtils';

function Register() {
  const [state, dispatch] = useContext(AppContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState([] as string[])
  const [email, setEmail] = useState('')
  const history = useHistory()

  useEffect(() => {
    state.socket.on("register-response", (res: AuthState) => {
      if (res.loggedIn) {
        dispatch({ type: "LOGIN", payload: res })
        history.push("/");
      }
    })
  }, [])

  const registerUser = () => {
    const usernameError = nameValidation("Username", username)
    const passwordError = nameValidation("Password", password)
    const emailError = emailValidation(email)

    if (!usernameError && !passwordError && !emailError) {
      state.socket.emit("register", { username, password, email })

    }
    else {
      const allErrors: string[] = [];
      [usernameError, passwordError, emailError].forEach((error: string | null) => {
        if (error && error.length > 0) {
          allErrors.push(error)
        }
      })
      setErrorMessage(allErrors)
    }
  }

  return (
    <div className="col-12 p-0 flex center fill">
      <div className="col-4 p-0 flex center">
        <h3>Join the club</h3>
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
            placeholder="Email"
            aria-label="Email"
            aria-describedby="basic-addon2"
            onChange={(value: ChangeEvent<any>) => setEmail(value.target.value)}
          />
        </InputGroup>
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
            onChange={(value: ChangeEvent<any>) => setPassword(value.target.value)}
          />
        </InputGroup>
        <Button onClick={() => registerUser()}>Sign up</Button>

        <div className="col-12 mt-3">
          Already have an account? <Link to="/">Log in</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
