// import
import {
  getStorageItem,
  setStorageItem,
  formatPrice,
  getElement,
} from '../utils.js';
import { openCart } from './toggleCart.js';
import { findProduct } from '../store.js';
import addToCartDOM from './addToCartDOM.js';
// set items

const cartItemCountDOM = getElement('.cart-item-count');
const cartItemsDOM = getElement('.cart-items');
const cartTotalDOM = getElement('.cart-total');

let cart = getStorageItem('cart');


export const addToCart = (id) => {
  let item = cart.find((cartItem) => cartItem.id === id);
  if (!item) {
    let product = findProduct(id);
    // adding item to the cart
    product = { ...product, amount: 1 };
    cart = [...cart, product]
    // adding item to the DOM
    addToCartDOM(product)
  } else {

  }
  // update items count
  displayCartItemsCount()
  // display cart totals
  displayCartTotal()
  // calculate total

  // set cart in the local storage
  setStorageItem('cart', cart)
  openCart()
};

function displayCartItemsCount() {
  const amount = cart.reduce((total, cartItem) => {
    return total += cartItem.amount;
  }, 0)
  cartItemCountDOM.textContent = amount;
}
function displayCartTotal() {
  let total = cart.reduce((total, cartItem) => {
    return total += cartItem.price * cartItem.amount;
  }, 0)
  cartTotalDOM.textContent = `Total : ${formatPrice(total)}`
}

function displayCartItemsDOM(){
  cart.forEach((cartItem)=> addToCartDOM(cartItem))
}
function setupCartFunctionality(){

}

const init = () => {
  displayCartItemsCount();
  displayCartTotal();
  displayCartItemsDOM();
  setupCartFunctionality();
}

init()