import { dsp } from '../redux/init';
import {
  changeTheme, decrement, increment, // asyncIncrement,
} from '../redux/actions';
import Timer from '../components/Timer';

interface IProps {
  value: number;
}

interface IReduxDemo {
  render: () => string;
  afterRender: () => void;
  update: (props: IProps) => void;
  closeHandler: () => void;
}

const ReduxDemo: IReduxDemo = {
  render: () => `
    <h2 class="heading">
      Redux Demo Page
    </h2>
      <button class="btn btn-info" id="theme">Сменить тему</button>

    <hr>

    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Счетчик: <span id="counter"></span></h5>
        <button class="btn btn-primary" id="add">+ 1</button>
        <button class="btn btn-danger" id="sub">- 1</button>
      </div>
    </div>

    <div id="forTimer"></div>
  `,
  afterRender: () => {
    const addBtn = document.getElementById('add');
    const subBtn = document.getElementById('sub');
    const themeBtn = document.getElementById('theme');

    // обработчики
    if (addBtn && subBtn && themeBtn) {
      addBtn.addEventListener('click', () => {
        dsp(increment());
      });

      subBtn.addEventListener('click', () => {
        dsp(decrement());
      });

      themeBtn.addEventListener('click', () => {
        const newTheme = document.body.classList.contains('light') ? 'dark' : 'light';
        dsp(changeTheme(newTheme));
      });
    }

    const timerPlace = document.getElementById('forTimer') as HTMLElement;
    timerPlace.innerHTML = Timer.render();
    const byeHandler = Timer.afterRender();

    return byeHandler;
  },
  update: ({ value }: IProps) => {
    const counterElement = document.getElementById('counter');
    if (counterElement) counterElement.textContent = value.toString();
  },
  closeHandler: () => {
    console.log('redux bye!');
    Timer.closeHandler();
  },
};

export default ReduxDemo;
