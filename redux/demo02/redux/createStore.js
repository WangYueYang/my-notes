
function createStore(reducer, initState){

  let state = initState

  let listeners = []

  function getState(){
    return state
  }

  function subscribe(listener){
    listeners.push(listener)
  }

  function dispatch(action) {
    state = reducer(state,action)

    for(let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }
  }

  return {
    getState,
    subscribe,
    dispatch
  }
}

export {
  createStore
}