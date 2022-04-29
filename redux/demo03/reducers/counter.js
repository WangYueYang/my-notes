const initState = {
  count: 0
}


export default function counterReducer(state,action) {
  if (!state) {
    state = initState
  }

  switch (action.type) {
    case 'ADDCOUNT':
      return {
        ...state,
        count: state.count + 3
      }
      break;
  
    default:
      return state
      break;
  }
}