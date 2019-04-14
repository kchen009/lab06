import React from "react";
import { observer } from "mobx-react";

export const UserTable = observer(({ usersStore }) => (
    <table>
        <tbody>
            <tr>
                <th>id</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email Name</th>
                <th>Role</th>
            </tr>
            {usersStore.users.map(t => (
                <TableView
                    key={t.id}
                    user={t}
                />
            ))}
        </tbody>
    </table>
));

export const TableView = ({ user }) => (
    <tr >
        <td>{user.id}</td>
        <td>{user.firstName}</td>
        <td>{user.lastName}</td>
        <td>{user.email}</td>
        <td>{user.role}</td>
    </tr>
);