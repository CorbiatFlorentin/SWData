import React, { useEffect, useState } from "react";
import UserTable from "../components/UserTable";
import StatsWidget from "../components/StatsWidget";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            return navigate("/login");
        }

        fetch("http://localhost:5000/admin/users", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => {
                if (!res.ok) throw new Error("Accès refusé ou erreur serveur");
                return res.json();
            })
            .then((data) => setUsers(data))
            .catch((err) => {
                console.error("Erreur chargement users:", err);
                navigate("/login");
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleDeleteUser = async (id) => {
        const token = localStorage.getItem("token");
        if (!window.confirm("Supprimer cet utilisateur ?")) return;

        try {
            const res = await fetch(`http://localhost:5000/admin/users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const result = await res.json();
            if (res.ok) {
                setUsers(users.filter((u) => u.user_id !== id));
            } else {
                alert(result.error);
            }
        } catch (err) {
            console.error("Erreur suppression:", err);
        }
    };

    const handleChangeRole = async (id, role) => {
        const token = localStorage.getItem("token");
        const newRole = role === "admin" ? "user" : "admin";

        try {
            console.log("Changing role for ID:", id);
            
            const res = await fetch(`http://localhost:5000/admin/users/${id}/role`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ role: newRole }),
            });

            const result = await res.json();
            if (res.ok) {
                setUsers(users.map((u) => (u.user_id === id ? { ...u, role: newRole } : u)));
            } else {
                alert(result.error);
            }
        } catch (err) {
            console.error("Erreur changement de rôle:", err);
        }
    };

    return (
        <div className="admin-container">
            <h1>Tableau de bord Admin</h1>
            <StatsWidget />
            {loading ? (
                <p>Chargement des utilisateurs...</p>
            ) : (
                <UserTable users={users} onDelete={handleDeleteUser} onRoleChange={handleChangeRole} />
            )}
        </div>
    );
};

export default AdminPage;
