import * as types from '../constants/ActionTypes'

export function receiveProducts(products) {
  return {
    type: types.RECEIVE_PRODUCTS,
    products: products
  }
}

export function addToCart(productId) {
  return {
    type: types.ADD_TO_CART,
    productId
  }
}

export function checkoutSuccess(cart) {
  return {
    type: types.CHECKOUT_SUCCESS,
    cart
  }
}

export function checkout(products) {
  return {
    type: types.CHECKOUT_REQUEST,
    payload: products
  }
}
