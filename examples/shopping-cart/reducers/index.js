import { combineReducers } from 'redux'
import { default as cart, getQuantity, getAddedIds } from './cart'
import { default as products, getProduct } from './products'
import * as types from '../constants/ActionTypes'

export function getTotal(state) {
  return getAddedIds(state.cart).reduce((total, id) =>
    total + getProduct(state.products, id).price * getQuantity(state.cart, id),
    0
  ).toFixed(2)
}

export function getCartProducts(state) {
  return getAddedIds(state.cart).map(id => ({
    ...getProduct(state.products, id),
    quantity: getQuantity(state.cart, id)
  }))
}

const mainReducers = combineReducers({
  cart,
  products
})

function checkValidity(state, action) {
  switch (action.type) {
    case types.ADD_TO_CART:
      return state.products.byId[action.productId].inventory > 0 && !state.cart.pending
    case types.CHECKOUT_REQUEST:
      return !state.cart.pending
    default:
      return true
  }
}

export default function reducer(state, action) {
  if (checkValidity(state, action)) {
    return mainReducers(state, action)
  } else {
    return state
  }
}
