

import React from "react";
import DashboardScreen from "./dashboard-screen/page";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

const Dashboard = async () => {
    const session = await getServerSession(options);
    console.log("session", session);

    if (!session) {
      redirect("/auth/login?callbackUrl=/dashboard/manage-distributors");
    }

    return (
        <DashboardScreen />
    );
};

export default Dashboard;