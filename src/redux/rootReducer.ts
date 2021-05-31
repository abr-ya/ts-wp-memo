import { combineReducers } from 'redux';
import {
  CHANGE_THEME, DECREMENT, DISABLE_BUTTONS, ENABLE_BUTTONS, INCREMENT,
  START, STOP, FIRST,
  GSTART, GSTOP, MATCH, ERROR,
} from './types';
import { IAction } from './interfaces';

const initialCounterState = {
  value: 0,
};

const counterReducer = (state = initialCounterState, action: IAction) => {
  switch (action.type) {
    case INCREMENT:
      return { ...state, value: state.value + 1 };
    case DECREMENT:
      return { ...state, value: state.value - 1 };
    default: return state;
  }
};

const initialThemeState = {
  value: 'light',
  disabled: false,
};

const themeReducer = (state = initialThemeState, action: IAction) => {
  switch (action.type) {
    case CHANGE_THEME:
      return { ...state, value: action.payload };
    case ENABLE_BUTTONS:
      return { ...state, disabled: false };
    case DISABLE_BUTTONS:
      return { ...state, disabled: true };
    default: return state;
  }
};

const initialTimeState = {
  active: false,
  start: 0,
  stop: 0,
  firstRender: true,
};

const timeReducer = (state = initialTimeState, action: IAction) => {
  switch (action.type) {
    case START:
      return { ...state, active: true, start: Date.now() };
    case STOP:
      return { ...state, active: false, stop: Date.now() };
    case FIRST:
      return { ...state, firstRender: false };
    default: return state;
  }
};

const initialGameState = {
  active: false,
  moves: 0,
  errors: 0,
  size: 4,
};

const gameReducer = (state = initialGameState, action: IAction) => {
  switch (action.type) {
    case GSTART:
      return {
        ...state, active: true, moves: 0, errors: 0,
      };
    case GSTOP:
      return { ...state, active: false };
    case MATCH:
      return { ...state, moves: state.moves + 1 };
    case ERROR:
      return { ...state, moves: state.moves + 1, errors: state.errors + 1 };
    default: return state;
  }
};

const rootReducer = combineReducers({
  counter: counterReducer,
  theme: themeReducer,
  time: timeReducer,
  game: gameReducer,
});

export default rootReducer;
