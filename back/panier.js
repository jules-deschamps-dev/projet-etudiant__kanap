//import { post } from "./routes/product";

// ______________________________GLOBAL_______________________________
function newElement(tagname, attributs, inner, parentNode) {
  //tagname
  let newItem = document.createElement(tagname);
  //attributs
  if (attributs != null){
    for (let attribut in attributs){
      newItem.setAttribute(attribut, attributs[attribut]);
    }
  }
  //inner
  if (inner != null){
    newItem.textContent = inner;
  }
  //node
  if (parentNode != null){
    parentNode.appendChild(newItem);
  }
  return newItem;
}
// ________________________________________________________________________
// __________________________________________________________________________



//  AFFICHE LES PRODUITS DANS LE PANIER
const cartSynthesis = async () => {
  document.getElementById("order").setAttribute("onmouseover", "postForm()")
  let parent = document.getElementById("cart__items");
  let panierLocal = JSON.parse(localStorage.getItem("panier"));

  for (element of panierLocal){
    const result = await fetch("http://localhost:3000/api/products/" + element._id);
    let item =  await result.json();
    let itemResume = newElement('article', {"class" : "cart__item", "data-id" : element._id, "data-color" : element.color}, null, parent);
    let itemImg = newElement('div', {"class" : "cart__item__img"}, null, itemResume);
    newElement('img', {"src" : item.imageUrl, "alt" : "Photographie d'un canapé"}, null, itemImg);
    
    let itemContent = newElement('div', {"class" : "cart__item__content"}, null, itemResume);
    let itemContent_describe = newElement('div', {"class" : "cart__item__content__description"}, null, itemContent);
    newElement("h2", null, item.name, itemContent_describe);
    newElement("p", null, element.color, itemContent_describe);
    newElement("p", null, item.price * element.quantity + ' €', itemContent_describe);
    
    let itemContent_parameter = newElement('div', {"class" : "cart__item__content__settings"}, null, itemContent);
    newElement('p', null, element.quantity, itemContent_parameter);
    newElement('input', {'type' : "number", 'class' : 'itemQuantity', 'min' : '1', 'max' : '100', 'value' : element.quantity, 'onclick' : 'changeQuantity()'}, null, itemContent_parameter)

    let itemContent_delete = newElement('div', {"class" : "cart__item__content__settings__delete"}, null, itemContent);
    newElement('p', {'class' : 'deleteItem', 'onclick' : 'removeItem()'}, 'Supprimer', itemContent_delete);
  }
  total();
}




//  CALCUL DU TOTAL
const total = async () => {
  let totalPrice = 0;
  let totalQuantity = 0;
  let panierLocal = JSON.parse(localStorage.getItem('panier'));
  for (element of panierLocal){
    const result = await fetch("http://localhost:3000/api/products/" + element._id);
    let item =  await result.json();
    if (item._id == element._id ){
      totalPrice += item.price * element.quantity;
      totalQuantity += parseInt(element.quantity);
    }
  }
  
  document.getElementById("totalPrice").textContent = totalPrice;
  document.getElementById("totalQuantity").textContent = totalQuantity;
}// ________________________________________________________________________






//  FORMULAIRE //
const postForm = () => {
  //let contact = new Object;
  for (element of document.getElementsByTagName("input")){
    if (element.type != "submit" && element.type != "number"){
      //manageForm(element);    //controle le format des donnees du formulaire
      //contact[element.name] = element.value;
    }
  }
  let contact = {
    firstName: "Jules",
    lastName: "Deschamps",
    address: "178address",
    city: "Nimes",
    email: "bbbbbb@aaaaa.com",
   
  }

  //let products = getAllId();  //recupere les id des products
  
  let products = ["dezfzesdf"]

  console.log("products", products);
  console.log("contact", contact);

  products = JSON.stringify(products);
  contact = JSON.stringify(contact)

  let data = {
    "contact" : contact,
    "products" : products,
  }
  //data = JSON.parse(data);

  //console.log(data);
  
  let option = {
    'method': "POST",
    'body' : "data",
    'Headers' : {"Content-Type" : "application/json"}
  }

  //option = JSON.stringify(option);

  fetch(
    "http://localhost:3000/api/products/order", option
  );
  /*
  fetch(
    "http://localhost:3000/api/products/order", {
    method: "POST",
    data : 
    {
      "contact" : contact,
      "products" : products,
    }
    ,
    Headers : {
      "Content-Type" : "application/json"
    }
  });*/
}


const getAllId = () => {
  let panier = JSON.parse(localStorage.panier);
  let allId = new Array();
  for (element of panier){
    allId.push(element._id);
  }
  return allId;
}


const manageForm = (element) => {
  if (element.name == 'firstName' || element.name == "lastName"){
    if (! element.value.match(/^([a-zA-Z ]+)$/)){
      document.getElementById(String(element.name + "ErrorMsg")).textContent = "Veillez saisir une donnée valide";
      validateData = false;
    } else{
      document.getElementById(String(element.name + "ErrorMsg")).textContent = null;
      validateData = true;
    }
  }
}
// ________________________________________________________________________








const changeQuantity = () =>{
  let cart = getCart();
  let data = selectItem();
  let newQuantity = event.target.closest("div").childNodes[1].value;
  cart.filter(element => element._id == data.id || element.color == data.color)[0].quantity = newQuantity;
  let newQuantityPrint = event.target.closest("div").childNodes[0];
  newQuantityPrint.textContent = newQuantity;
  saveCart(cart);
}


const saveCart = (cart) => {
  localStorage.setItem("panier", JSON.stringify(cart));
  total();
}




const removeItem = () =>{
  let cart = getCart();
  let data = selectItem();
  data.target.remove();
  let result = cart.filter(element => element._id != data.id || element.color != data.color);
  saveCart(result);
}

const selectItem = () => {
  let target = event.target.closest("article");
  let id = target.dataset.id;
  let color = target.dataset.color;
  let data = {
    "target" : target,
    "id" : id,
    "color" : color
  }
  return data;
}

const getCart = () => {
  let cart = JSON.parse(localStorage.panier);
  return cart;
}




//        console.log(element.getAttribute("data-id"));













/*
function saveCart(cart){
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getCart(){
  let cart = localStorage.getItem(cart);
  if (cart == null){
    return [];
  } else {
    return JSON.parse(cart);
  }
}

function addToCart(item) {
  let cart = getCart();
  let foundProduct = cart.find(element => element._id == item._id);
  if (foundProduct != undefined){
    foundProduct.quantity++;
  } else{
    item.quantity = 1;
    cart.push(item);
  }
  saveCart(cart);
}

function removeItem(item){
  let cart = getCart();
  cart = cart.filter(element => element._id != findProduct._id);
}

function changeQuantity(item, quantity){
  let cart = getCart();
  let foundProduct = cart.find(element => element._id == item._id);
  if (foundProduct != undefined){
    foundProduct.quantity += quantity;
    if (foundProduct.quantity < 1){
      removeItem(foundProduct);
    } else {
      saveCart(cart);
    }
  }
}
*/