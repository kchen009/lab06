import { observable, action, computed } from 'mobx';


export class UsersStore {
    nextID = this.users.length - 1;
    @observable users = [
        {
            id: '0',
            firstName: 'bob',
            lastName: 'smith',
            email: 'adc@gmail.com',
            role: 'student'
        },
        {
            id: '1',
            firstName: 'kevin',
            lastName: 'wilson',
            email: 'kwilson@gmail.com',
            role: 'professor'
        },
        {
            id: '2',
            firstName: 'Steve',
            lastName: 'hart',
            email: 'shart@gmail.com',
            role: 'student'
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
        this.nextID += 1;
        let id = this.nextID;
        // this.users.push({ id: id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role });
        this.users.push({ id, ...user })
    };
}

export default UsersStore