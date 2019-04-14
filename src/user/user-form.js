import React, { Component } from "react";
import SimpleReactValidator from 'simple-react-validator'

class UserForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {
                firstName: '',
                lastName: '',
                email: '',
                role: 'student'
            },
            emailUsed: false
        }
        this.validator = new SimpleReactValidator();
    }
    handleChange(event) {
        this.setState({ user: { ...this.state.user, [event.target.name]: event.target.value } });
    }

    onFormSubmit(event) {
        event.preventDefault();

        if (this.validator.allValid() && !this.checkIfUserExists(this.state.user.email)) {
            this.props.usersStore.createUser(this.state.user);
        } else {
            this.validator.showMessages();
            // rerender to show messages for the first time
            this.forceUpdate();
        }
    }

    checkIfUserExists(email) {
        let emailUsed = this.props.usersStore.userEmails.includes(email);
        this.setState({ emailUsed })
        return emailUsed;
    }

    render() {
        return (
            <form onSubmit={event => this.onFormSubmit(event)}>
                <label htmlFor="firstName">First Name:</label>
                <input autoComplete="off" type="text" id="firstName" name="firstName" onChange={event => this.handleChange(event)} />
                {this.validator.message('firstName', this.state.user.firstName, 'required|alpha')}
                <br></br>
                <label htmlFor="lastName">Last Name:</label>
                <input autoComplete="off" type="text" id="lastName" name="lastName" onChange={event => this.handleChange(event)} />
                {this.validator.message('lastName', this.state.user.lastName, 'required|alpha')}
                <br></br>
                <label htmlFor="email">Email:</label>
                <input autoComplete="off" type="text" id="email" name="email" onChange={event => this.handleChange(event)} />
                {this.validator.message('email', this.state.user.email, 'required|email')}
                {this.state.emailUsed && (<div className="srv-validation-message">This email is already in use, please enter a different one.</div>)}
                <br></br>
                <label htmlFor="role">Role:</label>
                <select id="role" name="role" value={this.state.user.role} onChange={event => this.handleChange(event)}>
                    <option value="student">Student</option>
                    <option value="professor">Professor</option>
                </select>
                {this.validator.message('role', this.state.user.role, 'required')}
                <br></br>
                <input type="submit" value="Create Todo" />
            </form>
        )
    }
}

export default UserForm;