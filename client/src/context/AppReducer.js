export default (state, action) => {
  switch (action.type) {
    case "ADD_POST":
      return {
        ...state,
        transactions: state.transactions.filter(
          transaction => transaction.id !== action.payload
        )
      };
    case "DELETE_POST":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions]
      };
    case "UPDATE_POST":
      return {
        ...state
      };
    default:
      return state;
  }
};
