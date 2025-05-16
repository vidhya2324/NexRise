import { getIndustryInsights } from "@/actions/dashboard";
import { getUseronboardingStatus } from "@/actions/user";

import { redirect } from "next/navigation";
import React from "react";
import DashboardView from "./_components/dashboard-view";

const IndustryInsightsPage = async () => {
  const { isOnboarded } = await getUseronboardingStatus();
  const insights = await getIndustryInsights();

  if (!isOnboarded) {
    redirect("/onboarding");
  }
  return (
    <div>
      <DashboardView insights={insights} />
    </div>
  );
};

export default IndustryInsightsPage;
