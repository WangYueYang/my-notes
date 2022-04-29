export default function reducer(state, action) {
  switch (action.type) {
    case 'ADDCOUNT':
      return {
        ...state,
        count: action.count + 1,
      };
      break;
    case 'REDUCECOUNT':
      return {
        ...state,
        count: action.count - 1,
      };
      break;
    default:
      return state;
      break;
  }
}
