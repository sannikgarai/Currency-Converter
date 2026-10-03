const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");

const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

const msg = document.querySelector(".msg");


// ===============================
// Add currencies to dropdowns
// ===============================

for (let select of dropdowns) {

  for (let currCode in countryList) {

    let newOption = document.createElement("option");

    newOption.innerText = currCode;
    newOption.value = currCode;

    // Default From currency
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    }

    // Default To currency
    else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  // Change flag when currency changes
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}


// ===============================
// Update Exchange Rate
// ===============================

const updateExchangeRate = async () => {

  let amount = document.querySelector(".amount input");

  let amtVal = amount.value;

  // If amount is empty or less than 1
  if (amtVal === "" || amtVal < 1) {

    amtVal = 1;

    amount.value = "1";
  }


  try {

    // Get selected currencies
    let fromCurrency =
      fromCurr.value.toLowerCase();

    let toCurrency =
      toCurr.value.toLowerCase();


    // API URL
    const URL =
      `${BASE_URL}/${fromCurrency}.json`;

    console.log("API URL:", URL);


    // Fetch API
    let response =
      await fetch(URL);


    // Check response
    if (!response.ok) {

      throw new Error("API request failed");

    }


    // Convert response to JSON
    let data =
      await response.json();

    console.log("API Data:", data);


    // Get exchange rate
    let rate =
      data[fromCurrency][toCurrency];

    console.log("Exchange Rate:", rate);


    // Check rate
    if (rate === undefined) {

      throw new Error("Exchange rate not found");

    }


    // Calculate final amount
    let finalAmount =
      Number(amtVal) * rate;


    // Display result
    msg.innerText =
      `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;


  } catch (error) {

    console.error("Error:", error);


    // Display error message
    msg.innerText =
      "Unable to get exchange rate. Please try again.";

  }
};


// ===============================
// Update Flag
// ===============================

const updateFlag = (element) => {

  let currCode =
    element.value;

  let countryCode =
    countryList[currCode];


  let newSrc =
    `https://flagsapi.com/${countryCode}/flat/64.png`;


  let img =
    element.parentElement.querySelector("img");


  if (img) {

    img.src = newSrc;

  }
};


// ===============================
// Button Click
// ===============================

btn.addEventListener("click", (evt) => {

  evt.preventDefault();

  updateExchangeRate();

});


// ===============================
// Page Load
// ===============================

window.addEventListener("load", () => {

  updateExchangeRate();

});
