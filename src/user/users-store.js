import { observable, action, computed, configure } from 'mobx';
configure({ enforceActions: "always" });

export class UsersStore {
    nextID = this.users.length - 1;
    @observable fetchState = 'idle';
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

    // create a user
    @action
    createUser = user => {
        // let id = this.nextID += 1;
        let newUser = { ...user };
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
            })
            .catch(error => console.error('Error:', error));
    };

    // update users
    @action
    updateUsers = users => {
        this.users = users;
    };

    @action
    updateFetchState = state => {
        this.fetchState = state;
        console.log(this.fetchState);
    }

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