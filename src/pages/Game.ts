import store, { dsp } from '../redux/init';
import {
  stop, gstart, gstop, match, error,
} from '../redux/actions';
import Timer from '../components/Timer';
import './game.scss';

interface IGame {
  render: () => string;
  afterRender?: () => void;
}

interface IElement extends Element {
  dataset?: any;
  style?: any;
}

const closeCard = '<img class="back-face" src="img/js-badge.svg" alt="JS Badge" />';
const setSize = 2;
const list1 = ['angular', 'aurelia', 'backbone', 'ember', 'react', 'vue'];
const newCard = (key: string, size: number) => `
  <div
    class="memory-card"
    data-framework="${key}"
    style="width: calc(${100 / size}% - 10px); height: calc(${100 / size}% - 10px);"
  >
    <img class="front-face" src="img/${key}.svg" alt="${key}" />
    ${closeCard}
  </div>
`;

const Game: IGame = {
  render: () => {
    let html = `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">ходов: <span id="moves"></span></h5>
        <h5 class="card-title">ошибок: <span id="errors"></span></h5>
      </div>
    </div>
    <div id="forTimer"></div>
    <section class="memory-game">`;

    let i = 1;
    while ((setSize ** 2) / 2 >= i) {
      const key = list1[i % list1.length];
      html += newCard(key, setSize);
      html += newCard(key, setSize);
      i += 1;
    }

    html += '</section>';

    return html;
  },
  afterRender: () => {
    // логика игры
    const cards = document.querySelectorAll('.memory-card');

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard: HTMLElement;
    let secondCard: HTMLElement;

    const emptyDiv = document.createElement('div');

    function resetBoard() {
      [hasFlippedCard, lockBoard] = [false, false];
      [firstCard, secondCard] = [emptyDiv, emptyDiv];
    }

    function disableCards() {
      firstCard.dataset.open = 'true';
      secondCard.dataset.open = 'true';

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

    // сравнение карт
    function checkForMatch() {
      const isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
      if (isMatch) {
        disableCards();
        dsp(match());
      } else {
        unflipCards();
        dsp(error());
      }
    }

    function flipCard(this: HTMLElement) {
      console.log(this.dataset.open);

      if (this.dataset.open) {
        console.log('card is open, try another card');
        return;
      }

      if (lockBoard) {
        console.log('Для начала игры нажмите старт!');
        return;
      }
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
        // card.dataset.open = false;
      });
    };

    cards.forEach((card: IElement) => card.addEventListener('click', flipCard));
    shuffle();
    // /логика игры

    // получаем стартовое значение
    let oldState = store.getState().game;

    // проверяем блокировку
    lockBoard = !oldState.active;

    // обработчик подписки
    const storeHandler = () => {
      const state = store.getState().game;
      if (state.active !== oldState.active) {
        lockBoard = !state.active;
      }

      if (state.moves !== oldState.moves) {
        const movesPlace = document.getElementById('moves') as HTMLElement;
        const errorsPlace = document.getElementById('errors') as HTMLButtonElement;

        movesPlace.innerHTML = state.moves.toString();
        errorsPlace.innerHTML = state.errors.toString();

        const isWin = (state.moves - state.errors) * 2 === setSize ** 2;
        console.log(isWin);
        if (isWin) {
          console.log('победа!');
          // dsp(stop());
          // dsp(gstop());
        }
      }

      oldState = state;
    };

    // подписываемся на обновления
    const storeUnsubscribe = store.subscribe(storeHandler);

    // создаём обработчики
    const startHandler: () => void = () => {
      dsp(gstart());
    };

    const stopHandler: () => void = () => {
      dsp(gstop());
      // shuffle();
      console.log('здесь должен быть сброс');
    };

    // добавляем таймер
    const timerPlace = document.getElementById('forTimer') as HTMLElement;
    timerPlace.innerHTML = Timer.render();
    const TimerUnmountHandler = Timer.afterRender({ startHandler, stopHandler });

    // функция отписки
    const unmountHandler = () => {
      storeUnsubscribe();
      TimerUnmountHandler();
    };

    return unmountHandler;
  },
};

export default Game;
