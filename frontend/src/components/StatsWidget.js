import React, { useEffect, useState } from "react";

const StatsWidget = () => {
    const [stats, setStats] = useState({ totalUsers: 0 });

    useEffect(() => {
        fetch("http://localhost:5000/admin/stats")
            .then((res) => res.json())
            .then((data) => setStats(data))
            .catch((err) => console.error("Erreur chargement stats :", err));
    }, []);

    return (
        <div className="stats-widget">
            <h3>Statistiques</h3>
            <p>Utilisateurs inscrits : {stats.totalUsers}</p>
        </div>
    );
};

export default StatsWidget;
