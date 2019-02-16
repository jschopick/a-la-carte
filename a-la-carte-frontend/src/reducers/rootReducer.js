const initState = {
  weight: undefined
}

const rootReducer = (state = initState, action) => {
  if (action.type === "SET_WEIGHT") {
    return {
      ...state,
      weight: action.weight
    }
  }
  return state
}

export default rootReducer