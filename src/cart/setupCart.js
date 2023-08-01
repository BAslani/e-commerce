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
    const amount = increaseAmount(id)
    const items = [...cartItemsDOM.querySelectorAll('.cart-item-amount')];
    const newAmount = items.find((value) => value.dataset.id === id);
    newAmount.textContent = amount;
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
function removeItem(id){
  cart = cart.filter((cartItem) => cartItem.id !== id);
}

function increaseAmount(id){
  let newAmount;
  cart = cart.map((cartItem) => {
    if(cartItem.id === id){
      newAmount = cartItem.amount + 1
      cartItem = {...cartItem, amount: newAmount}
    }
    return cartItem
  })
  return newAmount;
}
function decreaseAmount(id){
  let newAmount;
  cart = cart.map((cartItem) => {
    if(cartItem.id === id){
      newAmount = cartItem.amount - 1
      cartItem = {...cartItem, amount: newAmount}
    }
    return cartItem
  })
  return newAmount;
}

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
  cartItemsDOM.addEventListener('click', function(e){
    const element = e.target;
    const parent = e.target.parentElement;
    const id = e.target.dataset.id;
    const parentID = e.target.parentElement.dataset.id;

    // remove
    if(element.classList.contains('cart-item-remove-btn')){
      removeItem(id);
      parent.parentElement.remove();
    }
    // increase
    if(parent.classList.contains('cart-item-increase-btn')){
      const newAmount = increaseAmount(parentID);
      parent.nextElementSibling.textContent = newAmount;
    }
    // decrease
    if(parent.classList.contains('cart-item-decrease-btn')){
      const newAmount = decreaseAmount(parentID);
      if (newAmount === 0){
        removeItem(parentID);
        parent.parentElement.parentElement.remove();
      }else{
        parent.previousElementSibling.textContent = newAmount;
      }
    }
    displayCartItemsCount();
    displayCartTotal();
    setStorageItem('cart', cart);
  })
}

const init = () => {
  displayCartItemsCount();
  displayCartTotal();
  displayCartItemsDOM();
  setupCartFunctionality();
}

init()