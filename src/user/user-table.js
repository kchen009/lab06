import React from "react";
import { observer } from "mobx-react";

export const UserTable = observer(({ usersStore }) => (
    <table>
        <tbody>
            <tr>
                <th>edit</th>
                <th>id</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email Name</th>
                <th>Role</th>
                <th>Active</th>
            </tr>
            {usersStore.users.map(t => (
                <TableRow
                    key={t.id}
                    user={t}
                    setEditingUser={usersStore.setEditingUser}
                />
            ))}
        </tbody>
    </table>
));

export const TableRow = ({ user, setEditingUser }) => (
    <tr >
        <td><button onClick={event => setEditingUser(user.id)}>edit</button></td>
        <td>{user.id}</td>
        <td>{user.first}</td>
        <td>{user.last}</td>
        <td>{user.email}</td>
        <td>{user.role}</td>
        <td>{user.active}</td>
    </tr>
);