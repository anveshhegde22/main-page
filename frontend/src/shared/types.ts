import type React from "react";

export type ActiveSection =
  | "dashboard"
  | "profile"
  | "project_search"
  | "employee_search"
  | "help"
  | "feedback";

export type AppsView = "all" | "favorites";
export type AppUsageRange = "daily" | "monthly" | "yearly";
export type MaximizedSection =
  | "apps"
  | "workflow"
  | "chart-bar"
  | "chart-apps-usage"
  | "chart-pie";
export type AdminToolId = "app-summary";

export interface AppDetails {
  appId: string;
  cat: string;
  sponsorDept: string;
  coordinator: string;
}

export interface AppItem {
  app_id?: number;
  name: string;
  tag: string;
  dot: string;
  accessType: string;
  details?: AppDetails;
  fav_app?: boolean;
  category?: string;
  sponsor_department?: string;
  lead?: string;
}

export interface WorkflowItem {
  id: number;
  app: string;
  workflow: string;
  pending: number;
}

export interface TopAppEntry {
  name: string;
  value: number;
}

export interface TopAppsData {
  daily: TopAppEntry[];
  monthly: TopAppEntry[];
  yearly: TopAppEntry[];
}

export interface PieEntry {
  name: string;
  value: number;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface EmployeeItem {
  name: string;
  role: string;
  dept: string;
  initials: string;
  color: string;
}

export interface WorkflowStatus {
  id: number;
  dotColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export interface NavItem {
  type: "nav";
  label: string;
  desc: string;
  icon: React.ElementType;
  action: () => void;
}

export interface CurrentUser {
  name: string;
  initials: string;
  isAdmin: boolean;
}

export interface AdminToolComponentProps {
  onClose: () => void;
}

export interface AdminToolDefinition {
  id: AdminToolId;
  label: string;
  desc: string;
  icon: React.ElementType;
  Component: React.LazyExoticComponent<React.ComponentType<AdminToolComponentProps>>;
}

export interface SearchResults {
  nav: NavItem[];
  apps: AppItem[];
  workflows: WorkflowItem[];
}

export interface CustomAppTickProps {
  x?: number | string;
  y?: number | string;
  payload?: {
    value?: string | number;
  };
  dark?: boolean;
  limit?: number;
  size?: number;
  weight?: number;
  color?: string;
  width?: number;
  [key: string]: unknown;
}
