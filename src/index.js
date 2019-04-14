import "./index.css";
import React, { Component, useState } from "react";
import { render } from "react-dom";

import { observable, action, computed } from "mobx";
import { observer } from "mobx-react";

// Stores are where the business logic resides
class TodoStore {
  nextID = 0;
  @observable todos = [];
  @observable filterType = "all";

  // compute a filtered list of todos
  @computed
  get filtered() {
    if (this.filterType === "all") {
      return this.todos;
    } else if (this.filterType === "completed") {
      return this.todos.filter(t => t.completed);
    } else {
      return this.todos.filter(t => !t.completed);
    }
  }

  @computed
  get totalTodoCount() {
    return this.todos.length;
  }

  @computed
  get completedTodoCount() {
    let count = this.todos.filter(t => t.completed).length
    return count;
  }

  // set a filter type: "all", "completed" or "active"
  @action
  setFilterType(filterType) {
    this.filterType = filterType;
  }

  // create a todo
  @action
  create = name => {
    let id = this.nextID;
    this.nextID += 1;
    this.todos.push({ id: id, name: name, completed: false });
  };

  // toggle the completion state of a todo
  @action
  toggle = id => {
    let todo = this.todos.find(e => e.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  };

  // remove completed todos
  @action
  removeCompletedTodos() {
    this.todos.replace(this.todos.filter(t => !t.completed));
  }
}

@observer
class TodoForm extends Component {
  constructor(props) {
    super(props);
  }

  @observable inputValue = "";

  onFormSubmit = event => {
    event.preventDefault();
    this.props.todoStore.create(this.inputValue);
    this.inputValue = "";
  };

  @action
  handleInputChange = event => {
    this.inputValue = event.target.value;
  };

  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <label>
          <input
            type="text"
            name="name"
            value={this.inputValue}
            onChange={this.handleInputChange}
          />
        </label>
        <input type="submit" value="Create Todo" />
      </form>
    );
  }
}

const Link = ({ active, children, onClick }) => {
  if (active) {
    return (
      <span>
        {" | "} {children}
      </span>
    );
  }

  return (
    <a href="#" onClick={onClick}>
      {" | "}
      {children}
    </a>
  );
};

const TodoFilter = observer(({ todoStore }) => (
  <span>
    <b>Filter Todos</b>:
    {["all", "completed", "active"].map((status, i) => (
      <Link
        key={i}
        active={todoStore.filterType === status}
        onClick={() => todoStore.setFilterType(status)}
      >
        {status}
      </Link>
    ))}
  </span>
));

const TodoList = observer(({ todoStore }) => (
  <table>
    <tbody>
      <tr>
        <th>Status</th>
        <th>Name</th>
      </tr>
      {todoStore.filtered.map(t => (
        <TodoView
          key={t.id}
          name={t.name}
          completed={t.completed}
          onClick={() => {
            todoStore.toggle(t.id);
          }}
        />
      ))}
    </tbody>
  </table>
));

const TodoView = ({ onClick, completed, name }) => (
  <tr >
    <td>
      <input type="checkbox"
        onChange={onClick}
        checked={completed}
      />
    </td>
    <td>
      {name}
    </td>
  </tr>
);

const TotalCompletedCount = observer(({ todoStore }) => (
  <div>
    {todoStore.completedTodoCount} tasks of {todoStore.totalTodoCount} completed
  </div>
));

const RemoveCompletedTodos = observer(({ todoStore }) => (
  <div>
    <button onClick={(event) => todoStore.removeCompletedTodos()}>
      Remove Completed Tasks
    </button>
  </div>
));

@observer
class JSONView extends Component {
  @observable showJSON = false;

  toggleShowJSON = () => {
    this.showJSON = !this.showJSON;
  };

  render() {
    return (
      <div>
        <input
          type="checkbox"
          name="showjson"
          value={this.showJSON}
          onChange={this.toggleShowJSON}
        />
        Show JSON
        {this.showJSON && <p>{JSON.stringify(this.props.store)}</p>}
      </div>
    );
  }
}

const TodoApp = observer(() => {

  const todoStore = new TodoStore();
  document.todoStore = todoStore

  console.log('todoapp')
  return (
    <div>
      <TodoForm todoStore={todoStore} />
      <hr />
      <TodoFilter todoStore={todoStore} />
      <hr />
      <TodoList todoStore={todoStore} />
      <TotalCompletedCount todoStore={todoStore} />
      <RemoveCompletedTodos todoStore={todoStore} />
      <hr />
      <JSONView store={todoStore} />
    </div>)
})


render(<TodoApp />, document.getElementById("root"));
