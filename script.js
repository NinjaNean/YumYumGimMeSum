const key = "yum-edVCa1E6zDZRztaq"; // My API key

const tenant = {
  id: "h474",
  name: "Nea",
};

const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "x-zocom": key,
  },
};

let cart = {};

let url = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu";

const wontonResponse = await fetch(url + "?type=wonton", options);
const wontonData = await wontonResponse.json();

const dipResponse = await fetch(url + "?type=dip", options);
const dipData = await dipResponse.json();

const drinkResponse = await fetch(url + "?type=drink", options);
const drinkData = await drinkResponse.json();

// console.log(wontonData.items);
// console.log(dipData.items);
// console.log(drinkData.items);

const sauceButton = document.querySelector(".sauce-buttons");
const drinksButton = document.querySelector(".drinks-buttons");
const menuPage = document.querySelector(".menu-page");
const cartPage = document.querySelector(".cart-page");
const etaPage = document.querySelector(".eta-page");
const receiptPage = document.querySelector(".receipt-page");
const orderList = document.querySelector(".order-list");
const numberOfItemInCart = document.querySelector(".orange-circle");

// Renderar ut meny valen:
wontonData.items.forEach((element) => {
  createMenuItem(element);
});

// Renderar ut dipp valen:
dipData.items.forEach((element) => {
  createDipOrDrinkList(element, sauceButton);
});

// Renderar ut dryck valen:
drinkData.items.forEach((element) => {
  createDipOrDrinkList(element, drinksButton);
});

document.querySelector(".cart-menu").addEventListener("click", () => {
  hideAllPages();
  cartPage.classList.remove("hide");
  document.body.style.backgroundColor = "#eeeeee";

  for (const [key, value] of Object.entries(cart)) {
    renderOrderCart(key, value);
    setPrice(key, value);
  }
});

document.querySelector(".home").addEventListener("click", () => {
  hideAllPages();
  menuPage.classList.remove("hide");
  document.body.style.backgroundColor = "#489078";
  orderList.innerHTML = "";
  total = 0;
});

document.querySelector("#order").addEventListener("click", () => {
  hideAllPages();
  etaPage.classList.remove("hide");
  document.body.style.backgroundColor = "#605858";
});

document.querySelector(".menu").addEventListener("click", (event) => {
  if (event.target.closest(".item")) {
    const item = event.target.closest(".item");
    item.classList.add("menu-option-active");

    uppdateCartNumber();
    updateCart(item.getAttribute("orderId"));
  }
});

document.querySelector(".sauce-buttons").addEventListener("click", (event) => {
  if (event.target.closest("button")) {
    const item = event.target.closest("button");
    item.classList.add("menu-option-active");

    uppdateCartNumber();
    updateCart(item.getAttribute("orderId"));
  }
});

document.querySelector(".drinks-buttons").addEventListener("click", (event) => {
  if (event.target.closest("button")) {
    const item = event.target.closest("button");
    item.classList.add("menu-option-active");

    uppdateCartNumber();
    updateCart(item.getAttribute("orderId"));
  }
});

// Funktion för att rendera ut meny valen.
function createMenuItem(food) {
  const menu = document.querySelector(".menu");

  let div = document.createElement("div");
  div.classList.add("item");
  div.setAttribute("orderId", food.id);

  let span = document.createElement("span");
  span.classList.add("dotts");
  let h2 = document.createElement("h2");
  h2.innerText = food.name;
  h2.append(span);
  h2.append(`${food.price} SEK`);
  let p = document.createElement("p");

  food.ingredients.forEach((type) => {
    p.innerText += `${type}, `;
  });

  p.innerText = p.innerText.slice(0, -2);

  div.append(h2, p);
  menu.append(div);
}

// Funktion för att rendera ut dipp och drick valen.
function createDipOrDrinkList(type, sort) {
  let button = document.createElement("button");
  button.setAttribute("orderId", type.id);
  button.innerText = type.name;

  sort.append(button);
}

// sätter hide på alla sectioner som ska föreställa mina sidor.
function hideAllPages() {
  cartPage.classList.add("hide");
  etaPage.classList.add("hide");
  receiptPage.classList.add("hide");
  menuPage.classList.add("hide");
}

// Renderar ut kundkorgen.
async function renderOrderCart(key, value) {
  const url = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu/";
  const item = await fetch(url + key, options);
  const itemData = await item.json();

  let div = document.createElement("div");
  div.classList.add("order-item");

  let span = document.createElement("span");
  span.classList.add("dotts");
  let h2 = document.createElement("h2");
  h2.innerText = itemData.item.name;
  h2.append(span);
  h2.append(`${[itemData.item.price * value]} SEK`);

  let container = document.createElement("div");
  let plusButton = document.createElement("button");
  let plusImg = document.createElement("img");
  plusImg.src = "./img/Union.png";
  let minusButton = document.createElement("button");
  let minusImg = document.createElement("img");
  minusImg.src = "./img/Rectangle 22.png";
  let p = document.createElement("p");
  p.innerText = value + " stycken";

  plusButton.append(plusImg);
  minusButton.append(minusImg);
  container.append(plusButton, p, minusButton);
  div.append(h2, container);
  orderList.append(div);
}

// Uppdaterar cart.
function updateCart(id) {
  if (cart[id]) {
    cart[id] += 1;
  } else {
    cart[id] = 1;
  }
}

// Uppdaterar visuel siffra på startsidan för hur många produkter man har i kundvagn.
function uppdateCartNumber() {
  let sum = 1;
  for (const [key, value] of Object.entries(cart)) {
    sum += value;
  }

  numberOfItemInCart.innerText = sum;
}

let total = 0;
// Sätter totala priset på ordern.
async function setPrice(key, value) {
  const price = document.querySelector(".price");
  const url = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu/";
  const item = await fetch(url + key, options);
  const itemData = await item.json();
  total += itemData.item.price * value;
  price.innerText = total + " SEK";
}
