import "./index.css";
import React, { Component } from "react";
import { render } from "react-dom";

import { observer } from "mobx-react";
import { UsersStore } from "./user/users-store";

import { UserTable } from "./user/user-table";
import UserForm from "./user/user-form";

@observer
class App extends Component {

  constructor() {
    super()
    this.usersStore = new UsersStore();
  }
  componentDidMount() {
    this.usersStore.fetchUsers();
  }

  render() {
    return (
      <div>
        <h2>Users</h2>
        <UserTable usersStore={this.usersStore} />
        <br />
        <h2>
          Create / Update User
          </h2>
        <UserForm usersStore={this.usersStore} />
        <br /><hr />
        <div>fetch state: {this.usersStore.fetchState}</div>
      </div>
    )

  }
}

render(<App />, document.getElementById("root"));
