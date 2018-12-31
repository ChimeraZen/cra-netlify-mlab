// productCreate.js
import mongoose from 'mongoose'

// Load the server
import db from './server'

// Load the Product Model
import Product from './productModel'

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  
  try {
    const data = JSON.parse(event.body),
          name = data.name,
          price = parseInt(data.price),
          id = mongoose.Types.ObjectId(),
          product = {
            _id: id,
            name: name,
            price: price,
            __v: 0
          },
          response = {
            msg: "Product successfully created",
            data: product
          }
    
    // Use Product.Model to create a new product
    await Product.create(product)

    return {
      statusCode: 201,
      body: JSON.stringify(response)
    }
  } catch (err) {
    console.log('product.create', err) // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({msg: err.message})
    }
  }
}