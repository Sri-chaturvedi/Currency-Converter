// =========================
// BASE URL FOR CURRENCY API
// =========================
const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";

// =========================
// SELECT DOM ELEMENTS
// =========================
const dropdown = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// =========================
// INITIAL LOAD: Update exchange rate
// =========================
window.addEventListener("load", () => {
  updateExchangeRate();
});

// =========================
// POPULATE DROPDOWNS WITH CURRENCIES
// =========================
for (let select of dropdown) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Set default selections
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  // Update flag when user changes dropdown
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// =========================
// FUNCTION: Update flag image
// =========================
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// =========================
// BUTTON CLICK EVENT: Convert currency
// =========================
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// =========================
// FUNCTION: Fetch exchange rate and display result
// =========================
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  // Validate input
  if (amtVal === "0" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();
  const URL = `${BASE_URL}/${from}.json`;

  try {
    let response = await fetch(URL);

    if (!response.ok) {
      throw new Error("Failed to fetch currency data.");
    }

    let data = await response.json();
    let rate = data[from][to];

    if (!rate) {
      msg.innerText = `Exchange rate not found for ${from.toUpperCase()} → ${to.toUpperCase()}`;
      return;
    }

    // Calculate final amount
    let finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "⚠️ Error fetching exchange rate. Try again later.";
    console.error(error);
  }
};
