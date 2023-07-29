import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Pages/Home'
import FormPreview from '../Pages/FormPreview'
import ThankYou from '../Pages/ThankYou'

export default function AllRoutes() {
  return (
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/preview-fill/:formID' element={<FormPreview/>}/>
        <Route path='/thankyou' element={<ThankYou/>}/>
    </Routes>
  )
}
