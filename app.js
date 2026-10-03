const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");


// Add currencies to dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");

    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } 
    else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}


// Update exchange rate
const updateExchangeRate = async () => {

  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  try {

    // Example:
    // USD → https://.../currencies/usd.json
    const URL =
      `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

    let response = await fetch(URL);

    if (!response.ok) {
      throw new Error("Unable to fetch exchange rate");
    }

    let data = await response.json();

    let fromCurrency = fromCurr.value.toLowerCase();
    let toCurrency = toCurr.value.toLowerCase();

    let rate = data[fromCurrency][toCurrency];

    let finalAmount = amtVal * rate;

    msg.innerText =
      `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;

  } catch (error) {

    console.log(error);

    msg.innerText = "Unable to get exchange rate. Please try again.";

  }
};


// Update flag
const updateFlag = (element) => {

  let currCode = element.value;

  let countryCode = countryList[currCode];

  let newSrc =
    `https://flagsapi.com/${countryCode}/flat/64.png`;

  let img =
    element.parentElement.querySelector("img");

  img.src = newSrc;
};


// Button click
btn.addEventListener("click", (evt) => {

  evt.preventDefault();

  updateExchangeRate();

});


// Run when page loads
window.addEventListener("load", () => {

  updateExchangeRate();

});
