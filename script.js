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
const cartButton = document.querySelector(".cart");
const menuPage = document.querySelector(".menu-page");
const cartPage = document.querySelector(".cart-page");
const etaPage = document.querySelector(".eta-page");
const receiptPage = document.querySelector(".receipt-page");

wontonData.items.forEach((element) => {
  createMenuItem(element);
});

dipData.items.forEach((element) => {
  createDipOrDrinkList(element, sauceButton);
});

drinkData.items.forEach((element) => {
  createDipOrDrinkList(element, drinksButton);
});

cartButton.addEventListener("click", () => {
  hideAllPages();
  cartPage.classList.remove("hide");
});

function createMenuItem(food) {
  const menu = document.querySelector(".menu");

  let div = document.createElement("div");
  div.classList.add("item");

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

function createDipOrDrinkList(type, sort) {
  let button = document.createElement("button");
  button.innerText = type.name;

  sort.append(button);
}

function hideAllPages() {
  cartPage.classList.add("hide");
  etaPage.classList.add("hide");
  receiptPage.classList.add("hide");
  menuPage.classList.add("hide");
}
