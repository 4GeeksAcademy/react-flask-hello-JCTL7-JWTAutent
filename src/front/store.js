export const initialStore = () => {
  return {
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ],
    token: localStorage.getItem("token") || null,
    isAuthenticated: false,
    user: null
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };

    case 'login_success':
      return {
        ...store,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true
      };

    case 'logout':
      return {
        ...store,
        token: null,
        user: null,
        isAuthenticated: false
      };
      
    case 'add_task':
      const { id, color } = action.payload
      return {
        ...store,
        todos: store.todos.map((todo) => 
          todo.id === id ? { ...todo, background: color } : todo
        )
      };

    default:
      throw Error('Unknown action.');
  }    
}