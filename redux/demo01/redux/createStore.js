
function createStore(initState){
  console.log('hahah')

  let state = initState

  let listeners = []

  function getState(){
    return state
  }

  function subscribe(listener){
    listeners.push(listener)
  }

  function changeState(newState) {
    state = newState

    for(let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }
  }

  return {
    getState,
    subscribe,
    changeState
  }
}

export {
  createStore
}