import React from 'react'
import { useLocation, useParams } from 'react-router-dom'

export function Room() {
    const location = useLocation()

    const { roomCode } = useParams()
    if (!roomCode) {
        return <span>Room not Found :/</span>
    }
    return <div>{roomCode}</div>
}
