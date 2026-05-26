import type { AppItem, AppsView } from "../../shared/types";

function matchesAppSearch(app: AppItem, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return [
    app.name,
    app.tag,
    app.accessType,
    app.category,
    app.sponsor_department,
    app.lead,
    app.details?.appId,
    app.details?.cat,
    app.details?.sponsorDept,
    app.details?.coordinator,
  ].some((value) => value?.toLowerCase().includes(normalizedQuery));
}

function filterApps(apps: AppItem[], view: AppsView, search: string) {
  return apps
    .filter((app) => view === "all" || app.fav_app)
    .filter((app) => matchesAppSearch(app, search));
}

export function getFilteredCardApps(apps: AppItem[], view: AppsView, search: string) {
  return filterApps(apps, view, search);
}

export function getFilteredDrawerApps(apps: AppItem[], view: AppsView, search: string) {
  return filterApps(apps, view, search);
}

export function getAppsSearchResults(apps: AppItem[], search: string) {
  return apps.filter((app) => matchesAppSearch(app, search));
}

export function getCardEmptyMessage(view: AppsView, count: number) {
  if (count > 0) {
    return "";
  }

  return view === "favorites"
    ? "No favorite apps found"
    : "No apps found";
}
