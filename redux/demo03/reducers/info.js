const initState = {
  name: 'wyy',
  age: 22
}

export default function infoReducer(state, action) {
  if (!state) {
    state = initState
  }

  switch (action.type) {
    case "CHANGENAME":
      return {
        ...state,
        name: action.name
      }
      break;
  
    default:
      return state
      break;
  }
}