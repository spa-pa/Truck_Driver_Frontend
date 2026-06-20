// -----------------------------
// Menu Configuration by User Role
// -----------------------------

/**
 * Super Admin Menu
 */
export const superAdminMenu = {
  menu:
    [
      {
        "active": false,
        "icon": "Home",
        "id": 1,
        "level": 1,
        "path": "/dashboard",
        "title": "Dashboard",
        "type": "link"
      },
      {
        "active": false,
        "icon": "Paper",
        "id": 2,
        "level": 1,
        "path": "/project-history",
        "title": "Project History",
        "type": "link"
      },
      {
        "active": false,
        "icon": "Swap",
        "id": 3,
        "level": 1,
        "path": "/project-config",
        "title": "Project Config",
        "type": "link"
      },
      {
        "active": false,
        "children": [
          {
            "path": "/scheduler",
            "title": "Scheduler Config",
            "type": "link"
          },
          {
            "path": "/scheduler/logs",
            "title": "Scheduler Logs",
            "type": "link"
          }
        ],
        "icon": "Activity",
        "id": 4,
        "level": 1,
        "title": "Scheduler",
        "type": "sub"
      },
      {
        "active": false,
        "children": [
          {
            "path": "/email",
            "title": "Email Master",
            "type": "link"
          },
          {
            "path": "/website",
            "title": "Website Master",
            "type": "link"
          },
          {
            "path": "/port",
            "title": "Port Master",
            "type": "link"
          },
          {
            "path": "/charge",
            "title": "Charge Master",
            "type": "link"
          },
          {
            "path": "/unit",
            "title": "Unit Master",
            "type": "link"
          },
          {
            "path": "/vessel",
            "title": "Vessel Master",
            "type": "link"
          },
          {
            "path": "/vendor",
            "title": "Vendor Master",
            "type": "link"
          },
          {
            "path": "/berth",
            "title": "Berth Master",
            "type": "link"
          },
          {
            "path": "/pilotage",
            "title": "Pilotage Master",
            "type": "link"
          },
          {
            "path": "/anchorage",
            "title": "Anchorage Master",
            "type": "link"
          },
          {
            "path": "/commoditygroup",
            "title": "Commoditygroup Master",
            "type": "link"
          },
          // {
          //   "path": "/notify-email-config",
          //   "title": "Notify Email Master",
          //   "type": "link"
          // }
        ],
        "icon": "Document",
        "id": 5,
        "level": 1,
        "title": "Master",
        "type": "sub"
      }
    ]
};

/**
 * Customer Menu
 */
export const customerMenu = {
  menu: [
    { level: 1, id: 2, path: '/dashboard', title: "Dashboard", icon: "Home", active: true, type: "link" },
  ]
};

/**
 * Admin Menu
 */
export const AdminMenu = {
  menu: [
    { level: 1, id: 2, path: '/dashboard', title: "Dashboard", icon: "Home", active: true, type: "link" },
    { level: 1, id: 2, path: '/sample-operation', title: "Sample-operation", icon: "Work", active: true, type: "link" },
  ]
};
