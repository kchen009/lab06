import React, { Component } from "react";
import SimpleReactValidator from 'simple-react-validator'
import { observer } from "mobx-react";
import { observable, observe, action } from "mobx";

@observer
class UserForm extends Component {

    @observable user = this.props.usersStore.editingUser;
    @observable emailUsed = false;

    @action
    updateUser = (user) => {
        this.user = user;
    }
    @action
    updateEmailUsed = (boolean) => {
        this.emailUsed = boolean;
    }

    constructor(props) {
        super(props);

        // observe when editingUser changed
        observe(this.props.usersStore, 'editingUser', (change) => {
            this.updateUser(this.props.usersStore.editingUser);
        })

        this.validator = new SimpleReactValidator();
    }

    handleChange(event) {
        this.updateUser({ ...this.user, [event.target.name]: event.target.value });
    }

    onFormSubmit(event) {
        event.preventDefault();
        if (this.validator.allValid() && !this.doesUserExist(this.user.email)) {
            this.props.usersStore.saveUser(this.user);
            // reset the form after creating new user
            // event.target.reset();
        } else {
            this.validator.showMessages();
            // rerender to show messages for the first time
            this.forceUpdate();
        }
    }
    // checks if email is in use
    doesUserExist(email) {
        if (this.user.id) {
            return false
        } else {
            let emailUsed = this.props.usersStore.userEmails.includes(email);
            this.updateEmailUsed(emailUsed)
            return emailUsed;
        }
    }

    render() {
        return (
            <form onSubmit={event => this.onFormSubmit(event)}>
                <span>id: {this.user.id}</span><br />
                <label htmlFor="firstName">First Name:</label>
                <input autoComplete="off" type="text" id="first" name="first" onChange={event => this.handleChange(event)} value={this.user.first} />
                {this.validator.message('firstName', this.user.first, 'required|alpha')}
                <br></br>
                <label htmlFor="lastName">Last Name:</label>
                <input autoComplete="off" type="text" id="last" name="last" onChange={event => this.handleChange(event)} value={this.user.last} />
                {this.validator.message('lastName', this.user.last, 'required|alpha')}
                <br></br>
                <label htmlFor="email">Email:</label>
                <input autoComplete="off" type="text" id="email" name="email" onChange={event => this.handleChange(event)} value={this.user.email} />
                {this.validator.message('email', this.user.email, 'required|email')}
                {this.emailUsed && (<div className="srv-validation-message">This email is already in use, please enter a different one.</div>)}
                <br></br>
                <label htmlFor="role">Role:</label>
                <select id="role" name="role" value={this.user.role} onChange={event => this.handleChange(event)}>
                    <option value="student">Student</option>
                    <option value="professor">Professor</option>
                </select>
                {this.validator.message('role', this.user.role, 'required')}
                <br></br>
                <label htmlFor="role">Active:</label>
                <select id="active" name="active" value={this.user.active} onChange={event => this.handleChange(event)} value={this.user.active}>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
                {this.validator.message('role', this.user.active, 'required')}
                <br></br>
                <input type="submit" value="Create / Update User" />
            </form>
        )
    }
}

export default UserForm;