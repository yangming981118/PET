import {
  HOME_DELETE_SERVICE_BEGIN,
  HOME_DELETE_SERVICE_SUCCESS,
  HOME_DELETE_SERVICE_FAILURE,
  HOME_DELETE_SERVICE_DISMISS_ERROR,
} from './constants';

import AV from './../../../common/leancloud';

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function deleteService(args = {}, className = 'Service') {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_DELETE_SERVICE_BEGIN,
    });

    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise((resolve, reject) => {
      // doRequest is a placeholder Promise. You should replace it with your own logic.
      // See the real-word example at:  https://github.com/supnate/rekit/blob/master/src/features/home/redux/fetchRedditReactjsList.js
      // args.error here is only for test coverage purpose.
      const todo = AV.Object.createWithoutData(className, args.id);
      const doRequest = todo.destroy();
      doRequest.then(
        (res) => {
          dispatch({
            type: HOME_DELETE_SERVICE_SUCCESS,
            data: res.id,
          });
          resolve(res.id);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: HOME_DELETE_SERVICE_FAILURE,
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
export function dismissDeleteServiceError() {
  return {
    type: HOME_DELETE_SERVICE_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_DELETE_SERVICE_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        deleteServicePending: true,
        deleteServiceError: null,
      };

    case HOME_DELETE_SERVICE_SUCCESS:
      // The request is success
      return {
        ...state,
        deleteServicePending: false,
        deleteServiceError: null,
      };

    case HOME_DELETE_SERVICE_FAILURE:
      // The request is failed
      return {
        ...state,
        deleteServicePending: false,
        deleteServiceError: action.data.error,
      };

    case HOME_DELETE_SERVICE_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        deleteServiceError: null,
      };

    default:
      return state;
  }
}
