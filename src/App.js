import React, { Component } from 'react'
import './App.css'

import ProductTable from './components/ProductTable'

export default class App extends Component {
  render() {
    return (
      <div>
        <h1>Create-react-app, Netlify & mLab Demo</h1>
        <p>See the full guide <a href='https://medium.com/@chimera.zen/how-to-make-a-crud-with-netlify-create-react-app-mlab-mongodb-927a2e7ad2c3'>How to make a CRUD with Netlify, create-react-app & mLab MongoDB</a> for more information.<br />
GitHub repository: <a href='https://github.com/ChimeraZen/cra-netlify-mlab'>https://github.com/ChimeraZen/cra-netlify-mlab</a></p>
        <ProductTable />
      </div>
    )
  }
}
