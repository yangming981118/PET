import {
  HOME_ADD_SERVICE_BEGIN,
  HOME_ADD_SERVICE_SUCCESS,
  HOME_ADD_SERVICE_FAILURE,
  HOME_ADD_SERVICE_DISMISS_ERROR,
} from './constants';

import AV from './../../../common/leancloud';

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function addService(args = {}, className = 'Service') {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_ADD_SERVICE_BEGIN,
    });

    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise((resolve, reject) => {
      // doRequest is a placeholder Promise. You should replace it with your own logic.
      // See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
      // args.error here is only for test coverage purpose.
      const query = AV.Object.extend(className);
      const newObj = new query();
      for(let key of Reflect.ownKeys(args)) {
        newObj.set(key, args[key]);
      }
      if(className === 'Pet') {
        let ownerId = window.localStorage.getItem('ownerId') || 'error';
        newObj.set('ownerId', ownerId);
      }
      const doRequest = newObj.save();
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_ADD_SERVICE_SUCCESS,
            data: res.id,
          });
          resolve(res.id);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_ADD_SERVICE_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

// Async action saves request error by default, this method is used to dismiss the error info.
// If you don't want errors to be saved in Redux store, just ignore this method.
export function dismissAddServiceError() {
  return {
    type: HOME_ADD_SERVICE_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_ADD_SERVICE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        addServicePending: true,
        addServiceError: null,
      };

    case HOME_ADD_SERVICE_SUCCESS:
      // The request is success
      return {
        ...state,
        addServicePending: false,
        addServiceError: null,
      };

    case HOME_ADD_SERVICE_FAILURE:
      // The request is failed
      return {
        ...state,
        addServicePending: false,
        addServiceError: action.data.error,
      };

    case HOME_ADD_SERVICE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        addServiceError: null,
      };

    default:
      return state;
  }
}
