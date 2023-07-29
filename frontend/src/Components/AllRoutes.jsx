import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Pages/Home'
import FormPreview from '../Pages/FormPreview'

export default function AllRoutes() {
  return (
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/preview-fill/:formID' element={<FormPreview/>}/>
    </Routes>
  )
}
