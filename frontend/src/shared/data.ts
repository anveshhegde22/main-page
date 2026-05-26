import {
  IconActivity,
  IconBook,
  IconDatabase,
} from "@tabler/icons-react";


export const PIE_COLORS = ["#10b981", "#f43f5e", "#6366f1"];

export const DEV_LINKS = [
  { icon: IconActivity, label: "Development Logs", color: "#38bdf8", desc: "View recent dev activity", url: "https://pfirstdev2.pv.tatamotors:2001/pFirst/logs/" },
  { icon: IconBook, label: "Developer Docs", color: "#a78bfa", desc: "API & integration guides", url: "https://pfirstdev2.pv.tatamotors:2001/pFirst/docs/" },
  { icon: IconDatabase, label: "DBMS Tool", color: "#34d399", desc: "Database management", url: "https://pfirstdev2.pv.tatamotors:2001/pFirst/dbms/" },
];

export const NAV_ITEM_DEFS = [
  { label: "My Apps", desc: "Browse all your applications", iconName: "IconApps", actionKey: "myApps" },
  { label: "Favorite Apps", desc: "View your starred applications", iconName: "IconStarFilled", actionKey: "favApps" },
  { label: "Workflow Approvals", desc: "Pending actions across platforms", iconName: "IconChecklist", actionKey: "workflow" },
  { label: "Pending Activities Chart", desc: "App-wise activity distribution", iconName: "IconActivity", actionKey: "chartBar" },
  { label: "Top Used Apps Chart", desc: "Usage frequency analysis", iconName: "IconTrendingUp", actionKey: "chartApps" },
  { label: "Request Status Breakdown", desc: "Overall request lifecycle donut chart", iconName: "IconShieldCheck", actionKey: "chartPie" },
  { label: "Dev Center", desc: "Developer logs, docs & DBMS", iconName: "IconCode", actionKey: "devCenter" },
  { label: "Profile", desc: "Your profile details", iconName: "IconUser", actionKey: "profile" },
  { label: "Project Search", desc: "Find organisational projects", iconName: "IconBriefcase", actionKey: "projectSearch" },
  { label: "Employee Search", desc: "Search team members", iconName: "IconUsers", actionKey: "employeeSearch" },
] as const;
