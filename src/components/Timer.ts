import store, { dsp } from '../redux/init';
import { start, stop, first } from '../redux/actions';

interface IProps {
  value: number;
}

interface ITimer {
  render: () => string;
  afterRender: () => void;
  update: (props: IProps) => void;
  closeHandler: () => void;
}

const Timer: ITimer = {
  render: () => `
    <div class="card mt-3">
      <div class="card-body">
        <h5 class="card-title">Таймер: <span id="timer"></span></h5>
        <button class="btn btn-primary" id="start">Старт</button>
        <button class="btn btn-danger" id="stop">Стоп</button>
      </div>
    </div>
  `,
  afterRender: () => {
    const startBtn = document.getElementById('start') as HTMLButtonElement;
    const stopBtn = document.getElementById('stop') as HTMLButtonElement;

    // таймер
    // блок кнопки
    const disableBtn: (btn1: HTMLButtonElement, btn2: HTMLButtonElement, st: boolean)
    => void = (btn1, btn2, st) => {
      const blockedButton = st ? btn1 : btn2;
      const inblockedButton = !st ? btn1 : btn2;
      blockedButton.disabled = true;
      inblockedButton.disabled = false;
    };

    // работа таймера
    const showTimer: (st: number, fi: number, el: HTMLElement) => void = (st, fi, el) => {
      el.innerHTML = `${(fi - st) / 1000} секунд`;
    };

    // получаем стартовое значение
    let oldState = store.getState().time;
    if (oldState.firstRender) dsp(first());

    // блокируем кнопки
    disableBtn(startBtn, stopBtn, oldState.active);

    // 111
    const storeHandler = () => {
      const state = store.getState().time;
      if (state.active !== oldState.active) {
        // изменился статус таймера
        disableBtn(startBtn, stopBtn, state.active);
        if (state.active) {
          console.log('поехали!');
        } else {
          console.log(`таймер остановлен, прошло ${state.stop - state.start} мс`);
        }
      }

      oldState = state;
    };

    // подписываемся на обновления
    const storeUnsubscribe = store.subscribe(storeHandler);

    // создаём обработчики
    let timerWork: NodeJS.Timeout | null;
    const startDo: () => void = () => {
      dsp(start());
      const timerPlace = document.getElementById('timer') as HTMLElement;
      timerWork = setInterval(() => {
        const now = Date.now();
        showTimer(oldState.start, now, timerPlace);
      }, 100);
    };
    const stopDo: () => void = () => {
      dsp(stop());
      if (timerWork) clearInterval(timerWork);
    };

    // вешаем обработчики
    startBtn.addEventListener('click', startDo);
    stopBtn.addEventListener('click', stopDo);

    // функция отписки
    const byeHandler = () => {
      startBtn.removeEventListener('click', startDo);
      stopBtn.removeEventListener('click', stopDo);
      storeUnsubscribe();
    };

    return byeHandler;
  },
  update: () => false,
  closeHandler: () => false,
};

export default Timer;
