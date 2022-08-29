import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    Radio,
    RadioGroup,
    Typography,
    Grid,
    TextField,
    Button,
} from '@mui/material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export function CreateRoom() {
    const [votes, setVotes] = useState(2)
    const [canPause, setCanPause] = useState(true)
    const [formStatus, setFormStatus] = useState<'unsubmitted' | 'submitted' | 'error'>(
        'unsubmitted'
    )
    const [errorMessage, setErrorMessage] = useState<undefined | any>(undefined)

    async function handleSubmit({ canPause, votes }: { canPause: boolean; votes: number }) {
        console.log(canPause)
        const creatRoomEndpoint = '/api/create-room'
        const requestOptions: RequestInit = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                guest_can_pause: canPause,
                votes_to_skip: votes,
            }),
        }
        try {
            const response = await (await fetch(creatRoomEndpoint, requestOptions)).json()
            setFormStatus('submitted')
            console.log(response)
            return response
        } catch (error) {
            setFormStatus('error')
            console.error(error)
            return error
        }
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} alignItems="center">
                <Typography component="h4" variant="h4">
                    Create a Room
                </Typography>
            </Grid>
            <Grid item xs={12} alignItems="center">
                <FormControl component="fieldset">
                    <FormHelperText>Guest Control of Playback State</FormHelperText>
                    <RadioGroup
                        row
                        defaultValue="true"
                        onChange={e => setCanPause(e.target.value === 'true' ? true : false)}
                    >
                        <FormControlLabel
                            value="true"
                            control={<Radio color="primary" />}
                            label="Play/Pause"
                            labelPlacement="bottom"
                        ></FormControlLabel>
                        <FormControlLabel
                            value="false"
                            control={<Radio color="warning" />}
                            label="No Control"
                            labelPlacement="bottom"
                        ></FormControlLabel>
                    </RadioGroup>
                </FormControl>
                <Grid item xs={12} alignItems="center">
                    <FormControl>
                        <FormHelperText>Votes Required to Skip Song</FormHelperText>
                        <TextField
                            required={true}
                            type="number"
                            defaultValue={votes}
                            inputProps={{ min: 1, style: { textAlign: 'center' } }}
                            onChange={e => setVotes(parseInt(e.target.value))}
                        />
                    </FormControl>
                </Grid>
            </Grid>
            <Grid item xs={12} alignItems="center">
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => handleSubmit({ canPause, votes })}
                >
                    Create a Room
                </Button>
            </Grid>
            <Grid item xs={12} alignItems="center">
                <Button color="secondary" variant="contained" to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>
    )
}
