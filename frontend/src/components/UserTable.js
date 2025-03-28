import React from "react";

const UserTable = ({ users, setUsers }) => {
    const handleDelete = (id) => {
        const token = localStorage.getItem("token");
        fetch(`http://localhost:5000/admin/users/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => res.json())
            .then(() => setUsers(users.filter(user => user.id !== id)))
            .catch((err) => console.error("Erreur suppression :", err));
    };

    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.nom}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                            <button onClick={() => handleDelete(user.id)}>Supprimer</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UserTable;
