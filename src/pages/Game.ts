import './game.scss';

interface IGame {
  render: () => string;
  afterRender?: () => void;
}

interface IElement extends Element {
  dataset?: any;
  style?: any;
}

const Game: IGame = {
  render: () => `
    <section class="memory-game">
      <div class="memory-card" data-framework="aurelia">
        <img class="front-face" src="img/aurelia.svg" alt="Aurelia" />
        <img class="back-face" src="img/js-badge.svg" alt="JS Badge" />
      </div>
      <div class="memory-card" data-framework="aurelia">
        <img class="front-face" src="img/aurelia.svg" alt="Aurelia" />
        <img class="back-face" src="img/js-badge.svg" alt="JS Badge" />
      </div>

      <div class="memory-card" data-framework="vue">
        <img class="front-face" src="img/vue.svg" alt="Vue" />
        <img class="back-face" src="img/js-badge.svg" alt="JS Badge" />
      </div>
      <div class="memory-card" data-framework="vue">
        <img class="front-face" src="img/vue.svg" alt="Vue" />
        <img class="back-face" src="img/js-badge.svg" alt="JS Badge" />
      </div>

      <div class="memory-card" data-framework="angular">
        <img class="front-face" src="img/angular.svg" alt="Angular" />
        <img class="back-face" src="img/js-badge.svg" alt="JS Badge" />
      </div>
      <div class="memory-card" data-framework="angular">
        <img class="front-face" src="img/angular.svg" alt="Angular" />
        <img class="back-face" src="img/js-badge.svg" alt="JS Badge" />
      </div>

      <div class="memory-card" data-framework="ember">
        <img class="front-face" src="img/ember.svg" alt="Ember" />
        <img class="back-face" src="img/js-badge.svg" alt="JS Badge" />
      </div>
      <div class="memory-card" data-framework="ember">
        <img class="front-face" src="img/ember.svg" alt="Ember" />
        <img class="back-face" src="img/js-badge.svg" alt="JS Badge" />
      </div>

      <div class="memory-card" data-framework="backbone">
        <img class="front-face" src="img/backbone.svg" alt="Backbone" />
        <img class="back-face" src="img/js-badge.svg" alt="JS Badge" />
      </div>
      <div class="memory-card" data-framework="backbone">
        <img class="front-face" src="img/backbone.svg" alt="Backbone" />
        <img class="back-face" src="img/js-badge.svg" alt="JS Badge" />
      </div>

      <div class="memory-card" data-framework="react">
        <img class="front-face" src="img/react.svg" alt="React" />
        <img class="back-face" src="img/js-badge.svg" alt="JS Badge" />
      </div>
      <div class="memory-card" data-framework="react">
        <img class="front-face" src="img/react.svg" alt="React" />
        <img class="back-face" src="img/js-badge.svg" alt="JS Badge" />
      </div>
    </section>
  `,
  afterRender: () => {
    console.log('time to play');
    const cards = document.querySelectorAll('.memory-card');

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard: IElement;
    let secondCard: IElement;

    const emptyDiv = document.createElement('div');

    function resetBoard() {
      [hasFlippedCard, lockBoard] = [false, false];
      [firstCard, secondCard] = [emptyDiv, emptyDiv];
    }

    function disableCards() {
      firstCard.dataset.open = true;
      secondCard.dataset.open = true;

      resetBoard();
    }

    function unflipCards() {
      lockBoard = true;

      setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
      }, 1000);
    }

    function checkForMatch() {
      const isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
      if (isMatch) {
        disableCards();
      } else {
        unflipCards();
      }
    }

    function flipCard(this: any) {
      console.log('flip!');
      console.log(this.dataset.framework);
      console.log(this.dataset.open);

      if (this.dataset.open) {
        console.log('card is open, try another card');
        return;
      }

      if (lockBoard) return;
      if (this === firstCard) return;

      this.classList.add('flip');

      if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;

        return;
      }

      secondCard = this;
      checkForMatch();
    }

    const shuffle = () => {
      cards.forEach((card: IElement) => {
        const randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
      });
    };

    cards.forEach((card: IElement) => card.addEventListener('click', flipCard));
    shuffle();
  },
};

export default Game;
