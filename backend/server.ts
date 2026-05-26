import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/mainpage/get-app-lists", (req, res) => {
    const { limit, details, dark_mode } = req.body;

    let response = {};

    if (limit === true && details === false && dark_mode === true) {
        response = {
            statusCode: "10000",
            message: "success",
            data: {
                count: 1,
                data: {
                    dark_mode: false,
                    admin: false,
                    apps: [
                        { app_id: 2001, name: "pFirst Master", tag: "pFirst Master", fav_app: false, accessType: "private", dot: "#6366f1" },
                        { app_id: 2003, name: "OTracker CV", tag: "Generic customized web based workflow ecosystem, designed to facilitate the management of SoW at ERC", fav_app: true, accessType: "private", dot: "#34d399" },
                        { app_id: 2004, name: "OTracker PV", tag: "Generic customized web based workflow ecosystem, designed to facilitate the management of SoW at ERC", fav_app: true, accessType: "private", dot: "#ec4899" }
                    ],
                },
            },
        };
    }

    else if (limit === false && details === false && dark_mode === false) {
        response = {
            statusCode: "10000",
            message: "success",
            data: {
                count: 1,
                data: {
                    apps: [
                        { app_id: 2001, name: "pFirst Master", tag: "pFirst Master", fav_app: true, accessType: "private", dot: "#6366f1" },
                        { app_id: 2002, name: "OTracker HR", tag: "HR workflow platform", fav_app: false, accessType: "public", dot: "#f59e0b" },
                        { app_id: 2003, name: "OTracker CV", tag: "Generic customized web based workflow ecosystem, designed to facilitate the management of SoW at ERC", fav_app: true, accessType: "private", dot: "#34d399" },
                        { app_id: 2004, name: "OTracker PV", tag: "Generic customized web based workflow ecosystem, designed to facilitate the management of SoW at ERC", fav_app: true, accessType: "private", dot: "#ec4899" },
                        { app_id: 2005, name: "Finance Portal", tag: "Finance management system", fav_app: false, accessType: "private", dot: "#3b82f6" }
                    ],
                },
            },
        };
    }

    else if (details === true && dark_mode === false && limit === false) {
        response = {
            statusCode: "10000",
            message: "success",
            data: {
                count: 1,
                data: {
                    apps: [
                        { app_id: 2001, name: "pFirst Master", tag: "pFirst Master", fav_app: true, accessType: "private", dot: "#6366f1" },
                        { app_id: 2002, name: "OTracker CV", tag: "Workflow ecosystem", fav_app: true, accessType: "private", dot: "#34d399" },
                        { app_id: 2003, name: "OTracker PV", tag: "Project workflow ecosystem", fav_app: false, accessType: "private", dot: "#ec4899" },
                        { app_id: 2004, name: "Asset Tracker", tag: "Asset monitoring platform", fav_app: true, accessType: "public", dot: "#f59e0b" },
                        { app_id: 2005, name: "HR Connect", tag: "Employee management portal", fav_app: false, accessType: "private", dot: "#8b5cf6" }
                    ],
                },
            },
        };
    }

    else {
        response = {
            statusCode: "10001",
            message: "Invalid request",
            data: null,
        };
    }
    res.json(response);
});

app.post("/mainpage/get-fav-list", (req, res) => {
    const { limit } = req.body;
    let response = {};

    if (limit === true) {
        response = {
            statusCode: "10000",
            message: "success",
            data: {
                count: 1,
                data: {
                    dark_mode: true,
                    apps: [
                        { app_id: 2001, name: "pFirst Master", tag: "pFirst Master", accessType: "private", dot: "#6366f1" },
                        { app_id: 2003, name: "OTracker CV", tag: "Generic customized web based workflow ecosystem, designed to facilitate the management of SoW at ERC", accessType: "private", dot: "#34d399" },
                        { app_id: 2004, name: "OTracker PV", tag: "Generic customized web based workflow ecosystem, designed to facilitate the management of SoW at ERC", accessType: "private", dot: "#ec4899" }
                    ],
                },
            },
        };
    }
    else {
        response = {
            statusCode: "10000",
            message: "success",
            data: {
                count: 1,
                data: {
                    dark_mode: true,
                    apps: [
                        { app_id: 2001, name: "pFirst Master", tag: "pFirst Master", accessType: "private", dot: "#6366f1" },
                        { app_id: 2003, name: "OTracker CV", tag: "Generic customized web based workflow ecosystem, designed to facilitate the management of SoW at ERC", accessType: "private", dot: "#34d399" },
                        { app_id: 2004, name: "OTracker PV", tag: "Generic customized web based workflow ecosystem, designed to facilitate the management of SoW at ERC", accessType: "private", dot: "#ec4899" },
                        { app_id: 2005, name: "OTracker EV", tag: "Generic customized web based workflow ecosystem, designed to facilitate the management of SoW at ERC", accessType: "private", dot: "#22c55e" },
                    ],
                },
            },
        };
    }
    res.json(response);
});

app.post("/mainpage/manage-fav-app", (req, res) => {
    const { app_id, isFavorite } = req.body;
    let response = {};
    if (isFavorite) {
        response = {
            statusCode: "10000",
            message: `App ${app_id} added to favorites`,
        };
    }
    else {
        response = {
            statusCode: "10000",
            message: `App ${app_id} removed from favorites`,
        };
    }

    res.json(response);
});

app.post("/mainpage/manage-dark-mode", (req, res) => {
    const { dark_mode } = req.body;
    let response = {};
    if (dark_mode) {
        response = {
            statusCode: "10000",
            message: `dark mode enabled`,
        };
    }
    else {
        response = {
            statusCode: "10000",
            message: `dark mode disabled`,
        };
    }

    res.json(response);
});

app.post("/mainpage/get-workflow-list", (_req, res) => {
    res.json({
        statusCode: "10000",
        message: "success",
        data: {
            workflows: [
                { id: 1, app: "Beta Online", workflow: "Policy Approval", pending: 18 },
                { id: 2, app: "FleetTrack", workflow: "Driver Onboarding", pending: 8 },
                { id: 3, app: "ClaimsPortal", workflow: "Damage Assessment", pending: 42 },
                { id: 4, app: "DataHub", workflow: "Access Request", pending: 5 },
                { id: 5, app: "SupportSuite", workflow: "Ticket Escalation", pending: 24 },
            ],
        },
    });
});

app.post("/mainpage/get-chart-data", (_req, res) => {
    res.json({
        statusCode: "10000",
        message: "success",
        data: {
            topApps: {
                daily: [
                    { name: "Beta Online", value: 124 },
                    { name: "DataHub", value: 98 },
                    { name: "ClaimsPortal", value: 82 },
                    { name: "SupportSuite", value: 75 },
                    { name: "AgentConnect", value: 61 },
                ],
                monthly: [
                    { name: "Beta Online", value: 3840 },
                    { name: "DataHub", value: 2920 },
                    { name: "ClaimsPortal", value: 2450 },
                    { name: "SupportSuite", value: 2100 },
                    { name: "AgentConnect", value: 1850 },
                ],
                yearly: [
                    { name: "Beta Online", value: 45200 },
                    { name: "DataHub", value: 36800 },
                    { name: "ClaimsPortal", value: 28400 },
                    { name: "SupportSuite", value: 24200 },
                    { name: "AgentConnect", value: 21500 },
                ],
            },
            pieData: [
                { name: "Completed", value: 45 },
                { name: "Rejected", value: 15 },
                { name: "Pending", value: 40 },
            ],
        },
    });
});

app.get("/mainpage/get-faq", (_req, res) => {
    res.json({
        statusCode: "10000",
        message: "success",
        data: {
            faqs: [
                { q: "How do I request access to a new application?", a: "Navigate to 'All Apps', click the application, and select 'Request Access'. The request will be routed to your manager." },
                { q: "How can I update my profile picture?", a: "Profile pictures sync with your corporate directory. Please update your photo in the main HR portal." },
                { q: "What should I do if a workflow is stuck?", a: "If a workflow approval hasn't progressed for more than 48 hours, use the 'Escalate' button in the Workflow Approvals table." },
                { q: "Is there a mobile app available?", a: "Yes, pFirst 2.0 is fully responsive and can be installed as a PWA on your mobile device." },
            ],
        },
    });
});

app.post("/mainpage/get-app-info", (req, res) => {
    const { app_id } = req.body;
    res.json({
        statusCode: "10000",
        message: "success",
        data: {
            app_data: [
                {
                    app_id: app_id,
                    category: "Management",
                    sponsor_department: "Engineering",
                    lead: "Anvesh Hegde"
                },
            ],
        },
    });
});

app.get("/mainpage/get-employees", (_req, res) => {
    res.json({
        statusCode: "10000",
        message: "success",
        data: {
            employees: [
                { name: "Sarah Connor", role: "Product Manager", dept: "Product", initials: "SC", color: "core-from-rose-400 core-to-red-500" },
                { name: "John Smith", role: "Frontend Developer", dept: "Engineering", initials: "JS", color: "core-from-blue-400 core-to-indigo-500" },
                { name: "Emily Chen", role: "UX Designer", dept: "Design", initials: "EC", color: "core-from-emerald-400 core-to-green-500" },
                { name: "Michael Doe", role: "Data Scientist", dept: "Data", initials: "MD", color: "core-from-amber-400 core-to-orange-500" },
                { name: "Alice Johnson", role: "HR Manager", dept: "Human Resources", initials: "AJ", color: "core-from-purple-400 core-to-fuchsia-500" },
            ],
        },
    });
});

app.post("/mainpage/search-app", (req, res) => {
    const { search } = req.body;

    let allApps = {
        statusCode: "10000",
        message: "success",
        data: {
            apps: [
                { app_id: 2001, name: "pFirst Master", tag: "Centralized master data management platform for enterprise operations." },
                { app_id: 2002, name: "OTracker HR", tag: "Human resource management system for employee records and HR workflows." },
                { app_id: 2003, name: "OTracker CV", tag: "Customer visit tracking application for field and sales teams." },
                { app_id: 2004, name: "OTracker PV", tag: "Product verification and validation management application." },
                { app_id: 2005, name: "Finance Portal", tag: "Financial operations portal for budgeting, expenses, and reporting." },
                { app_id: 2006, name: "Employee Connect", tag: "Employee engagement and communication platform." },
                { app_id: 2007, name: "Asset Manager", tag: "Enterprise asset tracking and lifecycle management system." },
                { app_id: 2008, name: "Support Desk", tag: "Customer and internal support ticket management application." },
                { app_id: 2009, name: "Vehicle Tracker", tag: "Real-time vehicle monitoring and fleet tracking solution." },
                { app_id: 2010, name: "CRM Central", tag: "Customer relationship management platform for sales and support teams." },
                { app_id: 2011, name: "Leave Manager", tag: "Employee leave request and approval management system." },
                { app_id: 2012, name: "Payroll System", tag: "Payroll processing and salary management application." },
                { app_id: 2013, name: "Analytics Pro", tag: "Business intelligence and analytics reporting dashboard." },
                { app_id: 2014, name: "Dealer Connect", tag: "Dealer communication and distribution management platform." },
                { app_id: 2015, name: "Workshop Manager", tag: "Workshop operations and maintenance management application." },
                { app_id: 2016, name: "Logistics Portal", tag: "Logistics and shipment coordination management system." },
                { app_id: 2017, name: "Quality Check", tag: "Quality assurance and inspection workflow management tool." },
                { app_id: 2018, name: "Safety Monitor", tag: "Workplace safety monitoring and incident reporting platform." },
                { app_id: 2019, name: "Task Planner", tag: "Task assignment and project scheduling application." },
                { app_id: 2020, name: "Procurement Hub", tag: "Procurement and purchase order management system." },
                { app_id: 2021, name: "Training Portal", tag: "Employee learning and training management platform." },
                { app_id: 2022, name: "Vendor Manager", tag: "Vendor onboarding and supplier relationship management tool." },
                { app_id: 2023, name: "Project Tracker", tag: "Project progress monitoring and milestone tracking system." },
                { app_id: 2024, name: "IT Service Desk", tag: "IT issue management and technical support platform." },
                { app_id: 2025, name: "Production Monitor", tag: "Manufacturing production tracking and monitoring dashboard." },
                { app_id: 2026, name: "Attendance System", tag: "Employee attendance and shift tracking application." },
                { app_id: 2027, name: "Compliance Portal", tag: "Regulatory compliance tracking and documentation system." },
                { app_id: 2028, name: "Fleet Manager", tag: "Fleet operations and transportation management solution." },
                { app_id: 2029, name: "Travel Desk", tag: "Corporate travel booking and expense coordination platform." },
                { app_id: 2030, name: "Document Center", tag: "Centralized document storage and management system." },
                { app_id: 2031, name: "Knowledge Base", tag: "Knowledge sharing and documentation repository platform." },
                { app_id: 2032, name: "Operations Hub", tag: "Integrated operations management and monitoring dashboard." },
                { app_id: 2033, name: "Supplier Connect", tag: "Supplier collaboration and communication management portal." },
                { app_id: 2034, name: "Performance Tracker", tag: "Employee and organizational performance tracking system." },
                { app_id: 2035, name: "Audit Manager", tag: "Audit planning, execution, and reporting management application." },
                { app_id: 2036, name: "Digital Forms", tag: "Digital form creation and workflow automation platform." },
                { app_id: 2037, name: "Customer Care", tag: "Customer support and service request management system." },
                { app_id: 2038, name: "Marketing Studio", tag: "Marketing campaign planning and content management platform." },
                { app_id: 2039, name: "Approval Workflow", tag: "Multi-level approval and workflow automation system." },
                { app_id: 2040, name: "Resource Planner", tag: "Resource allocation and workforce planning application." },
                { app_id: 2041, name: "Service Portal", tag: "Self-service portal for employee and customer requests." },
                { app_id: 2042, name: "Engineering Hub", tag: "Engineering project collaboration and technical management platform." },
                { app_id: 2043, name: "Inspection Tool", tag: "Inspection scheduling and reporting management system." },
                { app_id: 2044, name: "Data Sync", tag: "Data synchronization and integration management utility." },
                { app_id: 2045, name: "Warranty Tracker", tag: "Warranty claim and service tracking application." },
                { app_id: 2046, name: "Plant Operations", tag: "Industrial plant operations monitoring and control platform." },
                { app_id: 2047, name: "Admin Console", tag: "Administrative configuration and system management dashboard." },
                { app_id: 2048, name: "User Access Manager", tag: "User authentication and role-based access control system." },
                { app_id: 2049, name: "Ticket Resolver", tag: "Issue resolution and support ticket handling application." },
                { app_id: 2050, name: "Beta Online", tag: "Executive insights and KPI visualization dashboard." }
            ],
        }
    };

    let filteredApps = [];

    // Check if search contains only numbers
    const isAppIdSearch = /^\d+$/.test(search);

    if (isAppIdSearch) {
        filteredApps = allApps.data.apps.filter((app) =>
            app.app_id.toString().includes(search)
        );
    } else {
        filteredApps = allApps.data.apps.filter((app) =>
            app.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    res.json({
        statusCode: "10000",
        message: "success",
        data: {
            apps: filteredApps
        }
    });
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});