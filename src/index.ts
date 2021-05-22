import store from './redux/init';
import './style.scss';
import {
  HomeComponent, Page1Component, Page2Component, ErrorComponent,
} from './pages/all';
import ReduxDemo from './pages/ReduxDemo';
import Game from './pages/Game';

let state = store.getState();

store.subscribe(() => {
  const newState = store.getState();
  // console.log(state, newState);

  const counter = document.getElementById('counter');
  if (counter) counter.textContent = newState.counter.value.toString();
  document.body.className = newState.theme.value;

  state = newState;
});

interface IRoute {
  path: string;
  component: any;
}

const body = document.querySelector('body');

if (body) {
  body.innerHTML = `
    <header>
      <h1>Webpack Starter with TS, Redux and Router</h1>
    </header>
    <nav>
      <a id="home" href="#/home">Home</a> -
      <a id="page1" href="#/page1">Page 1</a> -
      <a id="page2" href="#/page2">Page 2</a> -
      <a id="redux" href="#/redux">Redux Demo</a> -
      <a id="game" href="#/game">Game</a> -
    </nav>
    <div class="container pt-5" id="app"></div>
  `;
}

const app = document.querySelector('#app');

const routes: IRoute[] = [
  { path: '/', component: HomeComponent },
  { path: '/home', component: HomeComponent },
  { path: '/page1', component: Page1Component },
  { path: '/page2', component: Page2Component },
  { path: '/redux', component: ReduxDemo },
  { path: '/game', component: Game },
];

// eslint-disable-next-line no-restricted-globals
const parseLocation = () => location.hash.slice(1).toLowerCase() || '/';
const findComponentByPath = (path: string, rts: IRoute[]) => rts.find(
  (r) => r.path.match(new RegExp(`^\\${path}$`, 'gm')),
) || undefined;

let nowComponent: any;
let byeHandler: () => void | null;
const router = () => {
  // чистим
  if (nowComponent && nowComponent.closeHandler) nowComponent.closeHandler();
  if (byeHandler) byeHandler();
  // Find the component based on the current path
  const path = parseLocation();
  console.log('go to', path.slice(1));
  // If there's no matching route, get the "Error" component
  const { component = ErrorComponent } = findComponentByPath(path, routes) || {};
  nowComponent = component;
  // Render the component in the "app" placeholder
  if (app) {
    app.innerHTML = component.render();
    if (component.afterRender) byeHandler = component.afterRender();
    if (component.update) component.update(state.counter);
  }
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
