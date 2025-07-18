# 📝 Static Blog Generator (No Database)

A simple Express.js blog app. Stores and Displays blogs based on login features.

---

## 🚀 Features

- Two user roles: **Admin** and **Reader**
- Admin has CRD privileges (Create, Read and Delete)
- Reader has only read privileges.
- To avoid database, all blogs are saved as `.html` files in `/public/blogs`
- Clean separation of views, routes, and static files

## 🚑 Security Issues
- No Session Cookies
- No OWASP or similar Checklist followed

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- EJS (templating engine)
- Vanilla HTML/CSS
- File System (Node `fs` module)