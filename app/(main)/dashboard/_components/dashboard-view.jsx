/* "use client";

import {
  Brain,
  BriefcaseIcon,
  LineChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import React from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Progress } from "./ui/progress";
import { Item } from "@radix-ui/react-accordion";

const DashboardView = ({ insights }) => {
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));
  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const Outlookcolor = getMarketOutlookInfo(insights.marketOutlook).color;

  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Badge variant="outline">Last Updated: {lastUpdatedDate}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Market Outlook
            </CardTitle>
            <OutlookIcon className={`h-4 w-4 ${Outlookcolor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.marketOutlook}</div>
            <p>Next Update {nextUpdateDistance}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Industry Growth
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.growthRate.toFixed(1)}%
            </div>
            <Progress value={insights.growthRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.demandLevel}</div>
            <div
              className={`h-2 w-full rounded-full mt-3 ${getDemandLevelColor(
                insights.demandLevel
              )}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.topSkills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Salary Ranges by Role</CardTitle>
            <CardDescription>
              Displaying minimum, median, and maximum salaries (in thousands)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div style={{ height: "500px", width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border rounded-lg p-3 shadow-md text-black dark:text-black ">
                            <p className="font-semibold">{label}</p>
                            {payload.map((item, index) => (
                              <p key={index} className="text-sm">
                                {item.name}: ₹{item.value}K
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
                  <Bar
                    dataKey="median"
                    fill="#64748b"
                    name="Median Salary (K)"
                  />
                  <Bar dataKey="max" fill="#475569" name="Max Salary (K)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="w-full mt-6 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-zinc-900 border-0 text-white shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold text-white">
                  Key Industry Trends
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Current trends shaping the industry
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0"></CardContent>
            </Card>

            <Card className="bg-zinc-900 border-0 text-white shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold text-white">
                  Key Industry Trends
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Current trends shaping the industry
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0"></CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
 */

"use client";

import {
  Brain,
  BriefcaseIcon,
  LineChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import React from "react";
import { format, formatDistanceToNow } from "date-fns";

// import { Progress } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const DashboardView = ({ insights }) => {
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));
  
  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  
  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  // Split industry trends into two groups for the two cards
  const firstHalfTrends = insights.industryTrends ? 
    insights.industryTrends.slice(0, Math.ceil(insights.industryTrends.length / 2)) : [];
  const secondHalfTrends = insights.industryTrends ? 
    insights.industryTrends.slice(Math.ceil(insights.industryTrends.length / 2)) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Badge variant="outline">Last Updated: {lastUpdatedDate}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Market Outlook
            </CardTitle>
            <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.marketOutlook}</div>
            <p className="text-sm text-muted-foreground">Next Update {nextUpdateDistance}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Industry Growth
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.growthRate.toFixed(1)}%
            </div>
            <Progress value={insights.growthRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.demandLevel}</div>
            <div
              className={`h-2 w-full rounded-full mt-3 ${getDemandLevelColor(
                insights.demandLevel
              )}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {insights.topSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="mr-1 mb-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Salary Ranges by Role</CardTitle>
            <CardDescription>
              Displaying minimum, median, and maximum salaries (in thousands)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border rounded-lg p-3 shadow-md text-black dark:text-black">
                            <p className="font-semibold">{label}</p>
                            {payload.map((item, index) => (
                              <p key={index} className="text-sm">
                                {`${item.name}: ₹${item.value}K`}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
                  <Bar
                    dataKey="median"
                    fill="#64748b"
                    name="Median Salary (K)"
                  />
                  <Bar dataKey="max" fill="#475569" name="Max Salary (K)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-zinc-900 border-0 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-white">
              Key Industry Trends
            </CardTitle>
            <CardDescription className="text-gray-400">
              Current trends shaping the industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3.5">
              {insights.keyTrends.map((trend, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="mr-2 mt-0.5 rounded-full bg-blue-500 p-1">
                    <LineChart className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-0 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-white">
             Recommended Skills
            </CardTitle>
            <CardDescription className="text-gray-400">
              Skills to Consider Developing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3.5">
              {insights.recommendedSkills.map((trend, index,Skills) => (
                <li key={index} className="flex items-start">
                  <div className="mr-2 mt-0.5 rounded-full bg-blue-500 p-1">
                    <LineChart className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">{trend}</span>
                 
                </li>
                
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;