import initialState from './initialState';
import { reducer as getServiceReducer } from './getService';
import { reducer as addServiceReducer } from './addService';
import { reducer as changeServiceReducer } from './changeService';
import { reducer as deleteServiceReducer } from './deleteService';
import { reducer as countServiceReducer } from './countService';

const reducers = [
  getServiceReducer,
  addServiceReducer,
  changeServiceReducer,
  deleteServiceReducer,
  countServiceReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;
      break;
  }
  /* istanbul ignore next */
  return reducers.reduce((s, r) => r(s, action), newState);
}
