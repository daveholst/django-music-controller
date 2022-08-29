import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRoomData } from '../hooks'

export function Room() {
    const roomData = useRoomData()
    if (roomData.loading) {
        return <div>Loading...</div>
    }

    if (!roomData.loading && !roomData.error && roomData.data) {
        return (
            <div>
                <h1>Room Information</h1>
                <h3>id: {roomData.data.id}</h3>
                <h3>guests can pause: {roomData.data.guest_can_pause}</h3>
                <h3>votes to skip: {roomData.data.votes_to_skip}</h3>
                <h3>created: {new Date(roomData.data.created_at).toLocaleString()}</h3>
                <h3>last updated: {new Date(roomData.data.updated_at).toLocaleString()}</h3>
            </div>
        )
    }

    return <div>Error fetching Room: {JSON.stringify(roomData.error)}</div>
}
