import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface RoomData {
    id: number
    code: string
    host: string
    guest_can_pause: boolean
    votes_to_skip: number
    created_at: string
    updated_at: string
}

// TODO type this out....ehhhh, maybe
export function useRoomData() {
    const { roomCode } = useParams()
    const [data, setData] = useState<null | RoomData>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<null | any>(null)

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(`/api/room?code=${roomCode}`)
                if (!response.ok) {
                    const error = await response.json()
                    throw error
                }
                const resJson = await response.json()
                setData(resJson)
                setError(null)
            } catch (err) {
                setError(err)
                setData(null)
            } finally {
                setLoading(false)
            }
        }
        getData()
    }, [])
    return { data, loading, error }
}
