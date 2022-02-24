const cards = document.querySelectorAll(".memory-card");
const overlay = document.querySelector(".overlay");
const replay = document.querySelector(".replay");
const replayScore = replay.querySelector(".replay__score");
const header = document.querySelector(".header");
const reset = header.querySelector(".header__reset");
const playAgainButton = replay.querySelector(".replay__btn");
const results = document.querySelector(".records");
const closeResultButton = results.querySelector(".records__btn");
const resultHeader = document.querySelector(".header__records");
const resultContainer = document.querySelector(".records__score");

let hasFlippeCard = false;
let lock = false;
let firstCard, secondCard;
let clickCounter = 0;
let pairsCounter = 0;

//eventlisteners

reset.addEventListener("click", resetGame);
overlay.addEventListener("click", closeReplayMenu);
overlay.addEventListener("click", closeRecordTable);
playAgainButton.addEventListener("click", resetGame);
closeResultButton.addEventListener("click", closeRecordTable);
resultHeader.addEventListener("click", openRecordTable);
cards.forEach((card) => card.addEventListener("click", flipCard));
cards.forEach((card) => card.addEventListener("click", openReplayMenu));

// local storage

let records = JSON.parse(localStorage.getItem("records"));

if (localStorage.getItem("records") === null) {
  records = [];
}

class gameResult {
  constructor(gameNumber, clickCounter) {
    this.gameNumber = gameNumber;
    this.clickCounter = clickCounter;
  }
}

function updateRecords() {
  localStorage.setItem("records", JSON.stringify(records));
}

function addResultToRecords() {
  return records.push(new gameResult(gameNumber, clickCounter));
}

let gameNumber;
gameNumber = records.length ? records.length : 0;

function flipCard() {
  if (lock) return;
  if (this === firstCard) return;

  this.classList.toggle("flip");

  if (!hasFlippeCard) {
    clickCounter += 1;
    hasFlippeCard = true;
    firstCard = this;
    return;
  } else {
    clickCounter += 1;
    secondCard = this;
  }

  checkMatch();
  openReplayMenu();

  if (pairsCounter === 6) {
    gameNumber += 1;
    addResultToRecords();
    updateRecords();
    addGameResultToTable();
  }
}

function checkMatch() {
  let isMatch = firstCard.dataset.hero === secondCard.dataset.hero;
  isMatch ? disableEventListener() : unflipCards();
}

function disableEventListener() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  pairsCounter += 1;

  resetBoard();
}

function unflipCards() {
  lock = true;
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippeCard, lock] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function openReplayMenu() {
  if (pairsCounter === 6) {
    overlay.classList.add("active");
    replay.classList.add("active");
    replayScore.textContent = `You flipped the card ${clickCounter} times!`;
  }
}

function closeReplayMenu() {
  overlay.classList.remove("active");
  replay.classList.remove("active");
}

function resetGame() {
  resetBoard();
  closeReplayMenu();
  clickCounter = 0;
  pairsCounter = 0;
  cards.forEach((card) => card.classList.remove("flip"));
  cards.forEach((card) => card.addEventListener("click", flipCard));
  shuffleCards();
}

function openRecordTable() {
  overlay.classList.add("active");
  results.classList.add("active");
}

function closeRecordTable() {
  overlay.classList.remove("active");
  results.classList.remove("active");
}

function addGameResultToTable() {
  clearResults();

  records.sort((a, b) => parseInt(a.clickCounter) - parseInt(b.clickCounter));

  for (let item of records) {
    let game = document.createElement("div");
    let number = document.createElement("span");
    let score = document.createElement("span");
    game.classList.add("game");
    number.classList.add("number");
    score.classList.add("score");
    game.append(number, score);
    number.textContent = item.gameNumber;
    score.textContent = item.clickCounter;
    resultContainer.append(game);
  }
}

function clearResults() {
  while (resultContainer.firstChild) {
    resultContainer.removeChild(resultContainer.lastChild);
  }
}

// function changeGameNumber() {
//   for (let item of records) {
//     if (item.gameNumber === 1) {
//       records.splice(records.indexOf(item), 1);
//       break;
//     }
//   }
//   records.forEach((item) => (item.gameNumber -= 1));
// }

function shuffleCards() {
  if (gameNumber === 10) {
    gameNumber = 0;
    records = [];
    addGameResultToTable();
  }
  cards.forEach((card) => {
    let random = Math.floor(Math.random() * 12);
    card.style.order = random;
  });
}

window.onload = addGameResultToTable();
window.onload = shuffleCards();
