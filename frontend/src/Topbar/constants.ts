import {
  IconBriefcase,
  IconHelp,
  IconMessage,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import type { ActiveSection } from "../shared/types";

export const WORKSPACE_SECTIONS: ActiveSection[] = [
  "profile",
  "project_search",
  "employee_search",
  "help",
  "feedback",
];

export const WORKSPACE_MENU_ITEMS = [
  { section: "profile" as ActiveSection, icon: IconUser, label: "Profile Details" },
  { section: "project_search" as ActiveSection, icon: IconBriefcase, label: "Project Search" },
  { section: "employee_search" as ActiveSection, icon: IconUsers, label: "Employee Search" },
  { section: "help" as ActiveSection, icon: IconHelp, label: "Help" },
  { section: "feedback" as ActiveSection, icon: IconMessage, label: "Feedback" },
];
