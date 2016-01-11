import shop from '../api/shop'
import { fromEmitter } from '../../../lib'
import { receiveProducts, checkoutSuccess } from '../actions'
import { getCartProducts } from '../reducers'

const API = 'API'

function getAllProducts() {
  return {
    type: API,
    method: 'GET_PRODUCTS',
    events: {
      success: receiveProducts
    }
  }
}

function buyCart(products) {
  return {
    type: API,
    method: 'BUY_PRODUCTS',
    payload: products,
    events: {
      success: (cart) => checkoutSuccess(cart)
    }
  }
}

export function reactions(state) {
  return [
    (state.products.visibleIds.length == 0) && getAllProducts(),
    (state.cart.pending) && buyCart(getCartProducts(state))
  ]
}

export const REACTION_TYPES = {
  [API]: fromEmitter((reaction, emit) => {
    switch (reaction.method) {
      case 'GET_PRODUCTS':
        shop.getProducts((products) => emit('success', products))
        break
      case 'BUY_PRODUCTS':
        shop.buyProducts(reaction.payload, () => emit('success'))
        break 

    }
  })
}
