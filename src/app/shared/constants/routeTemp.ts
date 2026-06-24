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
      "badge": true,
      "children": [
        {
          "path": "/permission",
          "title": "Permission",
          "type": "link"
        },
        {
          "path": "/pages",
          "title": "Pages",
          "type": "link"
        },
        {
          "path": "/page-permission",
          "title": "Pages Permission",
          "type": "link"
        },
        {
          "path": "/role",
          "title": "Role",
          "type": "link"
        },
        {
          "path": "/role-permission",
          "title": "Role Page permission",
          "type": "link"
        }
      ],
      "icon": "Filter",
      "id": 21,
      "level": 1,
      "title": "Access Control",
      "type": "sub"
    },
    {
      "active": false,
      "children": [
        {
          "path": "/language",
          "title": "Language",
          "type": "link"
        },
        {
          "path": "/terminal",
          "title": "Terminal",
          "type": "link"
        },
        {
          "path": "/country",
          "title": "Country",
          "type": "link"
        },
        {
          "path": "/state",
          "title": "State",
          "type": "link"
        },
        {
          "path": "/city",
          "title": "City",
          "type": "link"
        }
      ],
      "icon": "Document",
      "id": 3,
      "level": 1,
      "title": "Master",
      "type": "sub"
    },
    {
      "active": false,
      "icon": "Activity",
      "id": 4,
      "level": 1,
      "path": "/training",
      "title": "Training",
      "type": "link"
    },
    {
      "active": false,
      "icon": "Activity",
      "id": 5,
      "level": 1,
      "path": "/training-result",
      "title": "Training Results",
      "type": "link"
    },
    {
      "active": false,
      "children": [
        {
          "path": "/video-configuration",
          "title": "Video Configuration",
          "type": "link"
        },
        {
          "path": "/quiz-configuration",
          "title": "Quiz Configuration",
          "type": "link"
        }
      ],
      "icon": "Swap",
      "id": 6,
      "level": 1,
      "title": "Training Configuration",
      "type": "sub"
    },
    {
      "active": false,
      "icon": "Swap",
      "id": 7,
      "level": 1,
      "path": "/qr-code-config",
      "title": "QR Configuration",
      "type": "link"
    }
  ]
};
