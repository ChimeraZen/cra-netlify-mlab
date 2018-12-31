// productUpdate.js
import mongoose from 'mongoose'

// Load the server
import db from './server'

// Load the Product Model
import Product from './productModel'

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  
  try {
    // Parse the ID
    const data = JSON.parse(JSON.parse(event.body)),
          id = data.id,
          product = data.product,
          response = {
            msg: "Product successfully updated",
            data: product
          }
    
    // Use Product.Model and id to update 
    await Product.findOneAndUpdate({_id: id}, product)
    
    return {
      statusCode: 201,
      body: JSON.stringify(response)
    }
  } catch(err) {
    console.log('product.update', err) // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({msg: err.message})
    }
  }
}