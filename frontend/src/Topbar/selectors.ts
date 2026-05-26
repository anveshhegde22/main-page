import { getAppsSearchResults } from "../features/apps/selectors";
import type { AppItem, NavItem, SearchResults, WorkflowItem } from "../shared/types";

export function getSearchResults(search: string, navItems: NavItem[], apps: AppItem[], workflows: WorkflowItem[]): SearchResults | null {
    if (!search.trim()) {
        return null;
    }

    const query = search.toLowerCase();
    const matchedNav = navItems.filter((item) => item.label.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query));
    const matchedApps = getAppsSearchResults(apps, query);
    const matchedWorkflows = workflows.filter((workflow) =>
        workflow.app.toLowerCase().includes(query) || workflow.workflow.toLowerCase().includes(query),
    );

    return { nav: matchedNav, apps: matchedApps, workflows: matchedWorkflows };
}
