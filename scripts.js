const slotWheel = document.querySelector(".slot__wheel");
const choicesContainer = document.querySelector(".choices__list");
const addButton = document.getElementById("add-button");
const choiceInput = document.getElementById("choice-input");
const leverHandle = document.getElementById("lever-handle");
let choices = [];

// Function to add a name to the list
function addChoice(choice) {
  choices.push(choice);
  updateDisplay();
  updateWheel();
  saveChoicesToLocalStorage();
}

// Function to remove a name from the list
function removeChoice(index) {
  choices.splice(index, 1);
  updateDisplay();
  updateWheel();
  saveChoicesToLocalStorage();
}

// Function to update the wheel display
function updateWheel() {
  slotWheel.innerHTML = "";
  // Add each name three times to create a repeating effect
  const repeatedChoices = [...choices, ...choices, ...choices];
  repeatedChoices.forEach((choice) => {
    const choiceDiv = document.createElement("div");
    choiceDiv.textContent = choice;
    slotWheel.appendChild(choiceDiv);
  });
}

// Function to update the display of choices
function updateDisplay() {
  choicesContainer.innerHTML = ""; // Clear existing display
  if (choices.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.classList.add("choices__empty");
    emptyMessage.textContent = "No Choices Added...";
    choicesContainer.appendChild(emptyMessage);
    return;
  }

  choices.forEach((choice, index) => {
    const choiceElement = document.createElement("div");
    choiceElement.classList.add("choices__item");
    choiceElement.textContent = choice;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "x";
    deleteButton.addEventListener("click", () => removeChoice(index));

    choiceElement.appendChild(deleteButton);
    choicesContainer.appendChild(choiceElement);
  });
}

// Get a random index
function getSecureRandomIndex(arrayLength) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return Math.floor((array[0] / 2 ** 32) * arrayLength);
}

// Function to spin the slot machine
function spin() {
  const choiceHeight = 200;
  const totalSpins = 2;
  const randomIndex = getSecureRandomIndex(choices.length);
  const totalDistance =
    (choices.length * totalSpins + randomIndex) * choiceHeight;

  slotWheel.style.transition = "transform 4s cubic-bezier(0.4, 0.0, 0.2, 1)";
  slotWheel.style.transform = `translateY(-${totalDistance}px)`;

  setTimeout(() => {
    slotWheel.style.transition = "none";
    slotWheel.style.transform = `translateY(-${randomIndex * choiceHeight}px)`;
  }, 4000);
}

// Function to get choices from local storage
function getChoicesFromLocalStorage() {
  const storedChoices = localStorage.getItem("choices");
  if (storedChoices) {
    choices = JSON.parse(storedChoices);
    updateDisplay();
    updateWheel();
  }
}

// Function to save choices to local storage
function saveChoicesToLocalStorage() {
  localStorage.setItem("choices", JSON.stringify(choices));
}

// Logic for showing tooltips
function showTooltips() {
  const tooltipChoices = document.querySelector(".tooltip--choices");
  const tooltipLever = document.querySelector(".tooltip--lever");
  const hasCompletedTutorial = localStorage.getItem("completedTutorial");

  // Checking if the user completed the tutorial previously
  if (hasCompletedTutorial) {
    return;
  }

  // Show first tooltip after a small delay
  setTimeout(() => {
    tooltipChoices.classList.remove("hidden");
  }, 1000);

  // Event listeners for tooltip buttons
  tooltipChoices
    .querySelector(".tooltip__next")
    .addEventListener("click", () => {
      tooltipChoices.classList.add("hidden");
      tooltipLever.classList.remove("hidden");
    });

  tooltipLever.querySelector(".tooltip__next").addEventListener("click", () => {
    tooltipLever.classList.add("hidden");

    // Setting that the user has completed the tutorial
    localStorage.setItem("completedTutorial", true);
  });
}

addButton.addEventListener("click", () => {
  const choice = choiceInput.value.trim();
  if (choice !== "") {
    addChoice(choice);
    choiceInput.value = "";
  }
});

leverHandle.addEventListener("click", () => {
  if (choices.length === 0) {
    alert("Please add choices to the list.");
    return;
  }

  leverHandle.disabled = true;
  leverHandle.classList.add("pulled");

  spin();

  // Reset lever after spin animation
  setTimeout(() => {
    leverHandle.classList.remove("pulled");
  }, 1000);

  // Reset lever button disable setting
  setTimeout(() => {
    leverHandle.disabled = false;
  }, 4100);
});

// Handle Enter key in input
choiceInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const choice = choiceInput.value.trim();
    if (choice !== "") {
      addChoice(choice);
      choiceInput.value = "";
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  showTooltips();
  getChoicesFromLocalStorage();
});
