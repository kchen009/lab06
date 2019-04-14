import "./index.css";
import React, { Component, useState } from "react";
import { render } from "react-dom";

import { observer } from "mobx-react";
import { UsersStore } from "./user/users-store";

import { TodoStore, TodoForm, TodoFilter, TodoList, TotalCompletedCount, RemoveCompletedTodos, JSONView } from "./todo";
import { UserTable } from "./user/user-table";
import UserForm from "./user/user-form";

class App extends Component {

  render() {

    const usersStore = new UsersStore();
    // document.usersStore = usersStore

    return (
      <div>
        <UserTable usersStore={usersStore} />
        <UserForm usersStore={usersStore} />
      </div>
    )

  }
}





// const TodoApp = observer(() => {

//   const todoStore = new TodoStore();
//   document.todoStore = todoStore

//   return (
//     <div>
//       <TodoForm todoStore={todoStore} />
//       <hr />
//       <TodoFilter todoStore={todoStore} />
//       <hr />
//       <TodoList todoStore={todoStore} />
//       <TotalCompletedCount todoStore={todoStore} />
//       <RemoveCompletedTodos todoStore={todoStore} />
//       <hr />
//       <JSONView store={todoStore} />
//     </div>)

// })



render(<App />, document.getElementById("root"));
