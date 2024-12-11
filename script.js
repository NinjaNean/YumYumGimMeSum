const key = "yum-edVCa1E6zDZRztaq";

const tenant = {
  id: "h474",
  name: "Nea",
};

const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
    "x-zocom": key,
  },
};

let cart = {};
let getOrderId = "";

let url = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu";

const wontonResponse = await fetch(url + "?type=wonton", options);
const wontonData = await wontonResponse.json();

const dipResponse = await fetch(url + "?type=dip", options);
const dipData = await dipResponse.json();

const drinkResponse = await fetch(url + "?type=drink", options);
const drinkData = await drinkResponse.json();

const sauceButton = document.querySelector(".sauce-buttons");
const drinksButton = document.querySelector(".drinks-buttons");
const menuPage = document.querySelector(".menu-page");
const cartPage = document.querySelector(".cart-page");
const etaPage = document.querySelector(".eta-page");
const receiptPage = document.querySelector(".receipt-page");
const orderList = document.querySelector(".order-list");
const numberOfItemInCart = document.querySelector(".orange-circle");
const hoverEffect = document.querySelector(".hover-effect");
const finishOrder = document.querySelector(".finish-order");

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
    updateTotalPrice();
  }
});

document.querySelector(".home").addEventListener("click", () => {
  hideAllPages();
  menuPage.classList.remove("hide");
  document.body.style.backgroundColor = "#489078";
  orderList.innerHTML = "";
});

document.querySelector("#order").addEventListener("click", () => {
  if (Object.keys(cart).length === 0) {
    return;
  } else {
    hideAllPages();
    etaPage.classList.remove("hide");
    document.body.style.backgroundColor = "#605858";
    sendOrder();
  }
});

document.querySelector(".menu").addEventListener("click", (event) => {
  if (event.target.closest(".item")) {
    const item = event.target.closest(".item");
    updateCart(item.getAttribute("orderId"));
  }
  updateCartNumber();
});

document.querySelector(".sauce-buttons").addEventListener("click", (event) => {
  if (event.target.closest("button")) {
    const item = event.target.closest("button");
    updateCart(item.getAttribute("orderId"));
  }
  updateCartNumber();
});

document.querySelector(".drinks-buttons").addEventListener("click", (event) => {
  if (event.target.closest("button")) {
    const item = event.target.closest("button");

    updateCartNumber();
    updateCart(item.getAttribute("orderId"));
  }
});

document.querySelector(".ghost-button").addEventListener("click", () => {
  hideAllPages();
  receiptPage.classList.remove("hide");
  renderOutReceipt();
});

document.querySelectorAll(".new-order").forEach((button) => {
  button.addEventListener("click", () => {
    hideAllPages();
    menuPage.classList.remove("hide");
    document.body.style.backgroundColor = "#489078";
    orderResetHandler();
  });
});

// Återställer beställningen genom att rensa valda menyer, tömma kundvagnen och återställa gränssnittet.
function orderResetHandler() {
  const item = document.querySelectorAll("[orderId]");
  cart = {};
  orderList.innerHTML = "";
  finishOrder.innerHTML = "";
  updateCartNumber();
  updateTotalPrice();

  const orderID = document.querySelectorAll(".order-id");
  orderID.forEach((order) => {
    order.innerText = "";
  });
}

// Skapar och lägger till ett menyalternativ i menyn baserat på matobjektet.
function createMenuItem(food) {
  const menu = document.querySelector(".menu");

  let div = document.createElement("div");
  div.classList.add("item");
  div.setAttribute("orderId", food.id);

  let span = document.createElement("span");
  span.classList.add("dotts");
  let h2 = document.createElement("h2");
  h2.innerText = food.name.toUpperCase();
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

// Skapar en knapp för dipp eller dryck och lägger till den i rätt kategori.
function createDipOrDrinkList(type, sort) {
  let button = document.createElement("button");
  button.setAttribute("orderId", type.id);
  button.innerText = type.name;

  sort.append(button);
}

// Döljer alla sidosektioner för att förbereda gränssnittet.
function hideAllPages() {
  cartPage.classList.add("hide");
  etaPage.classList.add("hide");
  receiptPage.classList.add("hide");
  menuPage.classList.add("hide");
}

// Renderar kundvagnens innehåll och uppdaterar gränssnittet med aktuell information.
async function renderOrderCart(key, value) {
  const url = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu/";
  const item = await fetch(url + key, options);
  const itemData = await item.json();

  let div = document.createElement("div");
  div.classList.add("order-item");
  div.setAttribute("cart-item-id", key);

  let span = document.createElement("span");
  span.classList.add("dotts");
  let h2 = document.createElement("h2");
  h2.innerText = itemData.item.name.toUpperCase();
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

  plusButton.addEventListener("click", () => {
    updateCart(key);
    value = cart[key];
    p.textContent = value + " stycken";

    h2.innerHTML = " ";
    h2.innerText = itemData.item.name;
    h2.append(span);
    h2.append(`${[itemData.item.price * value]} SEK`);

    updateTotalPrice();
    updateCartNumber();
  });

  minusButton.addEventListener("click", () => {
    decrementCartItem(key);
    value = cart[key];
    p.textContent = value + " stycken";

    h2.innerHTML = " ";
    h2.innerText = itemData.item.name;
    h2.append(span);
    h2.append(`${[itemData.item.price * value]} SEK`);

    updateTotalPrice();
    updateCartNumber();
  });
}

// Uppdaterar kundvagnen genom att lägga till en produkt eller öka dess antal.
function updateCart(id) {
  if (cart[id]) {
    cart[id] += 1;
  } else {
    cart[id] = 1;
  }
}

// Uppdaterar kundvagnen genom att minska antal eller ta bort produkten.
function decrementCartItem(id) {
  if (cart[id] > 1) {
    cart[id] -= 1;
  } else {
    delete cart[id];
    const item = document.querySelector(`[cart-item-id='${id}']`);
    const menuItem = document.querySelector(`[orderId='${id}']`);
    if (item) {
      item.remove();
    }
  }
}

// Uppdaterar visuel siffra på startsidan för hur många produkter man har i kundvagn.
function updateCartNumber() {
  let sum = 0;
  const orange = document.querySelector(".orange-circle ");

  for (const [key, value] of Object.entries(cart)) {
    sum += value;
  }

  if (sum != 0) {
    orange.classList.remove("hide");
  } else {
    orange.classList.add("hide");
  }

  numberOfItemInCart.innerText = sum;
}

// Räknar och uppdaterar det totala priset för beställningen.
async function updateTotalPrice() {
  let total = 0;
  const url = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu/";

  for (const [key, value] of Object.entries(cart)) {
    const item = await fetch(url + key, options);
    const itemData = await item.json();
    total += itemData.item.price * value;
  }

  const price = document.querySelectorAll(".price");
  price.forEach((price) => {
    price.innerText = total + " SEK";
  });
}

// Renderar ut kvittot
async function renderOutReceipt() {
  const url = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/receipts/";

  const order = await fetch(url + getOrderId, options);
  const orderData = await order.json();

  let itemData = orderData.receipt.items;

  itemData.forEach((food) => {
    console.log(food);
    let container = document.createElement("div");
    container.classList.add("finish-order-item");

    let h2 = document.createElement("h2");
    h2.innerText = food.name.toUpperCase();
    let span = document.createElement("span");
    span.classList.add("dotts");
    h2.append(span);
    h2.append(`${food.price} SEK`);

    let p = document.createElement("p");
    p.innerText = `${food.quantity} stycken`;

    container.append(h2, p);
    finishOrder.append(container);
  });
}

// Skickar ordern
async function sendOrder() {
  const url = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/h474/orders";
  let cartArray = cartToArrey();

  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-zocom": key,
    },
    body: JSON.stringify({ items: cartArray }),
  };

  const order = await fetch(url, option);
  const orderData = await order.json();

  getOrderId = orderData.order.id;
  const orderID = document.querySelectorAll(".order-id");
  orderID.forEach((order) => {
    order.innerText = "#" + getOrderId;
  });

  let time = etaTime(orderData.order.eta);

  const ETA = document.querySelector(".eta-time");
  ETA.innerText = `ETA ${time}`;
}

// Funktion som gör om cart till array
function cartToArrey() {
  let cartArray = [];

  for (const [key, value] of Object.entries(cart)) {
    for (let index = 0; index < value; index++) {
      cartArray.push(Number(key));
    }
  }

  return cartArray;
}

// Funktion som räknar ut ETA
function etaTime(targetTime) {
  const currentTime = new Date();
  const etaTime = new Date(targetTime);

  const differenceInMs = etaTime - currentTime;

  const totalMinutes = Math.floor(differenceInMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours} TIM ${minutes.toString().padStart(2, "0")} MIN`;
  }
  return `${minutes} MIN`;
}
