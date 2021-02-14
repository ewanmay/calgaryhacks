import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { AppContext } from '../../context/context';
import { Game } from '../../context/types';

interface ConnectSteamModalProps {
  close: any,
  game: Game
}

function SetPlayerModal({ close, game }: ConnectSteamModalProps) {
  const [state, dispatch] = useContext(AppContext)
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(0)
  const [inputError, setInputErro] = useState("")

  const isNumeric = (str: string) => {
    if (typeof str != "string") return false // we only process strings!  
    const trimmed: any = str.trim();
    const parsedInt = parseInt(trimmed as string);
    return !isNaN(trimmed as number) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parsedInt) // ...and ensure strings of whitespace fail
  }

  const setMinPlayers = (appid: any, minPlayers: string) => {
    if (!isNumeric(minPlayers)) {
      setInputErro("Min needs to be numeric")
    }
    else {
      setInputErro("")
    }
    state.socket.emit('change-game-min-players', ({ appid, minPlayers }))
    setMin(parseInt(minPlayers.trim()))
  }

  const setMaxPlayers = (appid: any, maxPlayers: string) => {
    if (!isNumeric(maxPlayers)) {
      setInputErro("Max needs to be numeric")
      return
    }
    else {
      setInputErro("")
      state.socket.emit('change-game-max-players', ({ appid, maxPlayers }))
      setMax(parseInt(maxPlayers.trim()))
    }
  }

  const setMinMaxPlayers = () => {

    if (min > max) {
      setInputErro("Max needs to be greater than or equal to minimum players allowed")
    }
    else {
      setInputErro("")
      state.socket.emit('update-preferred-players', state.authState.username, game.appid, min, max)
      close();
    }
    // update-preferred-players
  }

  useEffect(() => {
  }, [])
  return (
    <div className="modal-background flex center">
      <div className="modal flex center column">
        <div className="modal-header">
          Set player minimums and maximum for game
        </div>
        <div className="modal-body">
          This is taken into account with other inputs to provide an accurate count.
        </div>
        <div className="modal-bordy error-message">
          {inputError}
        </div>
        <InputGroup className="flex center">
          <FormControl
            placeholder={"" + (game.minPlayers ? game.minPlayers : 0)}
            aria-label="Min Players"
            className="col-3"
            aria-describedby="basic-addon2"
            onChange={(value: ChangeEvent<any>) => setMinPlayers(game.appid, value.target.value)}
          />
          <div className="col-1 px-1 modal-body">
            to
          </div>
          <FormControl
            placeholder={"" + (game.maxPlayers ? game.maxPlayers : 0)}
            aria-label="Max Players"
            className="col-3"
            aria-describedby="basic-addon2"
            onChange={(value: ChangeEvent<any>) => setMaxPlayers(game.appid, value.target.value)}
          />
          <div className="col-12 py-0">
            <Button className="mx-2" onClick={() => setMinMaxPlayers()}>Submit</Button>
            <Button className="mx-2" variant="secondary" onClick={() => close()}>Close</Button>
          </div>
        </InputGroup>
      </div>
    </div>
  )
}

export default SetPlayerModal;
