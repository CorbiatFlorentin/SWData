import React from "react";
import "../assets/style/UserTable.css";

const UserTable = ({ users, onDelete, onRoleChange }) => {
    return (
        <table className="user-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Pseudo</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Date de création</th>
                    <th>Dern. connexion</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.user_id}>
                        <td>{user.user_id}</td>
                        <td>{user.nom}</td>
                        <td>{user.prenom}</td>
                        <td>{user.pseudo}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.created_at?.slice(0, 10) || "-"}</td>
                        <td>{user.last_activity?.slice(0, 10) || "-"}</td>
                        <td>
                            <button onClick={() => onDelete(user.user_id)} className="btn-delete">
                                Supprimer
                            </button>
                            <button onClick={() => onRoleChange(user.user_id, user.role)} className="btn-role">
                                Switch Role
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UserTable;
