import React from 'react'
// not sure if this required? - django-vite docs said so
// import "vite/modulepreload-polyfill";
import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import reactLogo from "./assets/react.svg";
import './App.css'
import { CreateRoom, Home, JoinRoom } from './components'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreateRoom />} />
                <Route path="/join" element={<JoinRoom />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
