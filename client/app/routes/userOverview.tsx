import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { OperatorView } from "~/components/operatorview";
import { UserView } from "~/components/useroverview";

const HOST = import.meta.env.VITE_HOST;

export default function UserOverview() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function checkAuth() {
            const res = await fetch(`${HOST}/api/useroverview`, {
                credentials: "include",
            });

            if (res.ok) {
                const json = await res.json();
                setUser(json.user);
            } else {
                console.log("Failed to load page");
                navigate("/");
            }
            setLoading(false);
        }

        checkAuth();
    }, []);

    if (loading) {
        return <p>Loading...</p>
    }

    if (!user) {
        return <p>User not found.</p>
    }

    if (user.role == "driver") {
        return (
            <UserView name={user.name} />
        )
    } else {
        return (
            <OperatorView name={user.name} />
        )
    }

}