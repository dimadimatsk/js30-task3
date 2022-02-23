const cards = document.querySelectorAll(".memory-card");
let hasFlippeCard = false;
let lock = false;
let firstCard, secondCard;
let clickCounter = 0;
let pairsCounter = 0;

function flipCard() {
  clickCounter += 1;

  if (lock) return;

  if (this === firstCard) return;

  this.classList.toggle("flip");

  if (!hasFlippeCard) {
    hasFlippeCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
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

(function shuffleCards() {
  cards.forEach((card) => {
    let random = Math.floor(Math.random() * 12);
    card.style.order = random;
  });
})();

const overlay = document.querySelector(".overlay");
const replay = document.querySelector(".replay");
const replayScore = replay.querySelector(".replay__score");
const header = document.querySelector(".header");
const reset = header.querySelector(".header__reset");

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
  clickCounter = 0;
  pairsCounter = 0;
  cards.forEach((card) => card.classList.remove("flip"));
}

reset.addEventListener("click", resetGame);
overlay.addEventListener("click", closeReplayMenu);
cards.forEach((card) => card.addEventListener("click", flipCard));
cards.forEach((card) => card.addEventListener("click", openReplayMenu));
