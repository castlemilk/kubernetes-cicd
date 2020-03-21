import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import 
  { 
    Introduction,
  } from './presentation'

const routes = () => {
  return (
    <Router forceRefresh={true} >
      <div>
        <Route path='/' component={Introduction} />
      </div>
    </Router>
  )
}

export default routes
