const initState = {
  weight: undefined,
  gender: undefined,
  age: undefined,
  feet: undefined,
  inches: undefined,
  calories: undefined,
  meals: undefined,
  allergies: undefined,
  experience: undefined,
  goalWeight: undefined,
  fats: undefined,
  proteins: undefined,
  carbohydrates: undefined,
  activity: undefined
}

const rootReducer = (state = initState, action) => {
  if (action.type === "SET_WEIGHT") {
    return {
      ...state,
      weight: action.weight
    }
  }
  else if (action.type === "SET_GENDER") {
    return {
      ...state,
      gender: action.gender
    }
  }
  else if (action.type === "SET_AGE") {
    return {
      ...state,
      age: action.years
    }
  }
  else if (action.type === "SET_FEET") {
    return {
      ...state,
      feet: action.feet
    }
  }
  else if (action.type === "SET_INCHES") {
    return {
      ...state,
      inches: action.inches
    }
  }
  else if (action.type === "SET_CALORIES") {
    return {
      ...state,
      calories: action.calories
    }
  }
  else if (action.type === "SET_MEALS") {
    return {
      ...state,
      meals: action.meals
    }
  }
  else if (action.type === "SET_ALLERGIES") {
    return {
      ...state,
      allergies: action.allergies
    }
  }
  else if (action.type === "SET_ACTIVITY") {
    return {
      ...state,
      activity: action.activity
    }
  }
  else if (action.type === "SET_EXPERIENCE") {
    return {
      ...state,
      experience: action.experience
    }
  }
  else if (action.type === "SET_GOALWEIGHT") {
    return {
      ...state,
      goalWeight: action.goalWeight
    }
  }
  else if (action.type === "SET_FATS") {
    return {
      ...state,
      fats: action.fats
    }
  }
  else if (action.type === "SET_PROTEINS") {
    return {
      ...state,
      proteins: action.proteins
    }
  }
  else if (action.type === "SET_CARBOHYDRATES") {
    return {
      ...state,
      carbohydrates: action.carbohydrates
    }
  }

  return state
}

export default rootReducer