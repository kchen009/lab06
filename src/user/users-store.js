import { observable, action, computed, configure } from 'mobx';
configure({ enforceActions: "always" });

export class UsersStore {
    @observable fetchState = 'idle';
    @observable editingUser = {
        id: '',
        first: '',
        last: '',
        email: '',
        role: 'student',
        active: 'true'
    };
    @observable users = [
        {
            id: '0',
            first: 'bob',
            last: 'smith',
            email: 'adc@gmail.com',
            role: 'student',
            active: 'true'
        },
        {
            id: '1',
            first: 'kevin',
            last: 'wilson',
            email: 'kwilson@gmail.com',
            role: 'professor',
            active: 'true'
        },
        {
            id: '2',
            first: 'Steve',
            last: 'hart',
            email: 'shart@gmail.com',
            role: 'student',
            active: 'true'
        }

    ]

    // get array of user emails
    @computed
    get userEmails() {
        return this.users.map((user) => user.email);
    }

    @computed
    get getEditingUser() {
        return this.editingUser;
    }

    // update users
    @action
    updateUsers = users => {
        this.users = users;
    };

    // update  a specifc user based on their ID
    @action
    updateSpecificUser = updatedUser => {
        let index = this.users.findIndex(user => user.id === updatedUser.id);
        this.users[index] = updatedUser;
        this.users = [...this.users]
    }


    @action
    updateFetchState = fetchState => {
        this.fetchState = fetchState;
        console.log(this.fetchState);
    }

    @action
    setEditingUser = id => {
        this.editingUser = this.users.find(user => user.id === id);
        console.log(this.editingUser);
    }

    @action
    saveUser = (user) => {
        if (this.editingUser !== user) {
            this.editingUser = user;
            if (this.editingUser.id) {
                this.updateUser();
            } else {
                this.createUser();
            }
        }
    }

    @action
    resetEditingUser = () => {
        this.editingUser = {
            id: '',
            first: '',
            last: '',
            email: '',
            role: 'student',
            active: 'true'
        }
    }

    updateUser = () => {
        fetch(`http://localhost:5000/users/${this.editingUser.id}`, {
            method: 'PATCH',
            body: JSON.stringify(this.editingUser),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                console.log('Success:', JSON.stringify(response))
                this.updateSpecificUser(response);
                this.resetEditingUser();
            });
    }

    // create a user
    createUser = () => {
        let newUser = this.editingUser;
        console.log('newUser', newUser)
        fetch('http://localhost:5000/users', {
            method: 'post',
            body: JSON.stringify(newUser),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => {
                console.log('Success:', JSON.stringify(response))
                this.updateUsers(response)
                this.resetEditingUser();
            })
            .catch(error => console.error('Error:', error));
    };

    fetchUsers = () => {
        this.updateFetchState('pending');
        return fetch("http://localhost:5000/users")
            .then(res => res.json())
            .then(response => {
                this.updateUsers(response);
                this.updateFetchState('done');
            })
            .catch(error => {
                console.log(error)
                this.updateFetchState('error');
            })
    }
}

export default UsersStore