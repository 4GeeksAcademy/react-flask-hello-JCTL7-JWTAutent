const initialStore = () => {

  const token = localStorage.getItem("token");

  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    user = null;
  }

  return {
    message: null,
    token: token || null,
    user: user
  };
};

export default function storeReducer(store, action = {}) {

  switch (action.type) {

    case "login":

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));

      return {
        ...store,
        token: action.payload.token,
        user: action.payload.user
      };

    case "logout":

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return {
        ...store,
        token: null,
        user: null
      };

    default:
      return store;
  }
}

export { initialStore };