import React, { useEffect, useState } from "react";
import UserTable from "../components/UserTable";
import StatsWidget from "../components/StatsWidget";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }

        fetch("http://localhost:5000/admin/users", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((err) => console.error("Erreur chargement users :", err));
    }, [navigate]);

    return (
        <div className="admin-container">
            <h1>Tableau de bord Admin</h1>
            <StatsWidget />
            <UserTable users={users} setUsers={setUsers} />
        </div>
    );
};

export default AdminPage;
