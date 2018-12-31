// ProductTable.js
import React, { Component } from 'react'

export default class ProductTable extends Component {
  state = {
    products: [],
    inputs: [],
    newProduct: {
      name: '',
      price: 0
    }
  }

componentDidMount() {
    // Fetch the products from the database
    fetch('/.netlify/functions/productRead')
      .then(res => res.json())
      .then(response => {
        console.log(response.msg)
        const inputs = [...this.state.inputs],
              products = response.data
        
        products.forEach(product => {
          const productProps = this.setProductProps(product)
          inputs.push(productProps)
        })
        
        this.setState({ 
          products,
          inputs
        })
      })
      .catch(err => console.log('Error retrieving products: ', err))
  }

  // ProductProps
  setProductProps = (product) => {
    const productProps = {}
    
    // Cycle through product props and exclude props we don't want shown in the table
    Object.keys(product).forEach(key => {
      if (key !== '_id' && key !== '__v') {
        productProps[key] = product[key]
      }
    })
    
    return productProps
  }
  
  compareProductProps = (i) => {
    const product = this.state.products[i],
          input = this.state.inputs[i]
    
    let compare = false
    
    // Cycle though product props and exclude important props from comparison
    Object.keys(product).forEach(key => {
      if (key !== '_id' && key !== '__v') {
        if (product[key] !== input[key]) {
          // Found a difference between input and product
          compare = true
        }
      }
    })
    
    return compare
  }
  
  
  
  // Input handlers
  handleNewInputChange = (e) => {
    const newProduct = this.state.newProduct,
          name = e.target.name,
          value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value
    
    newProduct[name] = value
    
    this.setState({
      newProduct: newProduct
    })
  }
  
  handleInputChange = (e) => {
    const inputs = [...this.state.inputs],
          target = e.target,
          id = parseInt(target.dataset.id),
          name = target.name,
          value = target.value
    
    inputs[id][name] = value
    
    this.setState({
      inputs 
    })
  }
  
  
  
  // CRUD
  postAPI = (source, data) => {
    return fetch('/.netlify/functions/' + source, {
        method: 'post',
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .catch(err => err)
  }
  
  // CRUD Handlers
  handleCreate = () => {
    const newProduct = this.state.newProduct
    
    this.postAPI('productCreate', newProduct)
      .then(response => {
        console.log(response.msg)
      
        const product = response.data,
              products = [...this.state.products],
              inputs = [...this.state.inputs],
              newProduct = {
                name: '',
                price: 0
              },
              productProps = this.setProductProps(product)
        
        inputs.push(productProps)
        products.push(product)
        
        this.setState({ 
          products: products,
          inputs: inputs,
          newProduct: newProduct
        })
      })
      .catch(err => console.log('Product.create API error: ', err))
  }
  
  handleUpdate = (e) => {
    const products = [...this.state.products],
          inputs = [...this.state.inputs],
          index = parseInt(e.target.dataset.id),
          productData = inputs[index],
          oid = this.state.products[index]._id
    
    // Set product id and product data as JSON string
    const data = JSON.stringify({ id: oid, product: productData })
    
    this.postAPI('productUpdate', data)
      .then(response => {
        console.log(response.msg)
        const product = response.data
        
        // Set updated product props
        inputs[index] = this.setProductProps(product)
        products[index] = product
      
        this.setState({
          products,
          inputs
        })
      })
      .catch(err => console.log('Product.delete API error: ', err))
  }
  
  handleDelete = (e) => {
    const index = parseInt(e.target.dataset.id),
          id = this.state.products[index]._id
    
    this.postAPI('productDelete', id)
      .then(response => {
        console.log(response.msg)
        
        const inputs = [...this.state.inputs],
              products = [...this.state.products]
        
        inputs.splice(index, 1)
        products.splice(index, 1)
      
        this.setState({ 
          products: products,
          inputs:inputs
        })
      })
      .catch(err => console.log('Product.delete API error: ', err))
  }
  
  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input name='name' type='string' value={this.state.newProduct.name} onChange={this.handleNewInputChange} />
            </td>
            <td>
              <input name='price' type='number' value={this.state.newProduct.price} onChange={this.handleNewInputChange} />
            </td>
            <td>
              <button onClick={this.handleCreate}>&#43;</button>
            </td>
          </tr>
          {this.state.inputs.map((product, i) => {
            return <tr key={'product_' + i}>
              {Object.keys(product).map(key => {
                return <td key={'key_' + key}>
                  <input name={key} data-id={i} value={product[key]} onChange={this.handleInputChange} />
                </td>
                })}
              <td>
                {this.compareProductProps(i) && <button data-id={i} onClick={this.handleUpdate}>&#10004;</button>}
                <button data-id={i} onClick={this.handleDelete}>&#128465;</button>
              </td>
            </tr>
          })}
        </tbody>
      </table>
    )
  }
}