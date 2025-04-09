import React from "react";
import "../assets/style/UserTable.css"; // Crée ce fichier pour le style si tu veux

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
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.nom}</td>
                        <td>{user.prenom}</td>
                        <td>{user.pseudo}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.date_creation?.slice(0, 10) || "-"}</td>
                        <td>{user.derniere_connexion?.slice(0, 10) || "-"}</td>
                        <td>
                            <button onClick={() => onDelete(user.id)} className="btn-delete">
                                Supprimer
                            </button>
                            <button onClick={() => onRoleChange(user.id, user.role)} className="btn-role">
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