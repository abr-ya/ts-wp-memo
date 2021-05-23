import { createAction, createCustomAction } from 'typesafe-actions';
import {
  CHANGE_THEME, DECREMENT, DISABLE_BUTTONS, ENABLE_BUTTONS, INCREMENT,
  START, STOP, FIRST,
  GSTART, GSTOP, MATCH, ERROR,
} from './types';

export const increment = createAction(INCREMENT)();
export const decrement = createAction(DECREMENT)();
export const enableButtons = createAction(ENABLE_BUTTONS)();
export const disableButtons = createAction(DISABLE_BUTTONS)();
export const changeTheme = createCustomAction(
  CHANGE_THEME,
  (newTheme: string) => ({ payload: newTheme }),
);

// таймер
export const start = createAction(START)();
export const stop = createAction(STOP)();
export const first = createAction(FIRST)();

// игра
export const gstart = createAction(GSTART)();
export const gstop = createAction(GSTOP)();
export const match = createAction(MATCH)();
export const error = createAction(ERROR)();
