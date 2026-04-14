# 🏥 Enterprise Employee Management System
A high-performance, enterprise-grade RESTful management platform. This system leverages **Node.js** for secure orchestration and a native **C++ Analytics Engine** for heavy financial computations, delivering a premium user experience with real-time data visualization.
## ✨ Key Features
### 📊 Real-Time Dashboard
- **Dynamic Metrics**: Instant calculations for Total Employees, Annual Payroll, Department Counts, and Average Salary.
- **Visual Analytics**: Interactive widgets providing a bird's-eye view of your organization's human capital.

### ⚙️ High-Performance C++ Engine
- **Native Computations**: Offloads financial logic (Tax, Bonus, Net Pay) to a compiled C++ binary.
- **Calculated Metrics**:
  - 💹 **Professional Tax**: Automated deduction based on salary brackets.
  - 🏆 **Performance Bonus**: Dynamic bonus projections.
  - 💵 **Net Pay**: Accurate take-home pay calculations after native processing.

### 🔒 Enterprise-Grade Security
- **JWT Authentication**: Secure, token-based state management.
- **Bcrypt Protection**: Industry-standard password hashing.
- **Protected Routes**: Middleware-enforced authorization for all sensitive API endpoints.

### 📂 Data Portability
- **CSV Export**: One-click data portability for external reporting (Excel/Google Sheets).
- **File-Based Persistence**: Default JSON storage (MongoDB-ready for infinite scaling).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Node.js, Express.js |
| **Native Logic** | C++17 (Compiled Analytics Engine) |
| **Security** | JWT, Bcrypt.js, CORS |
| **Frontend** | Vanilla JS (ES6+), Modern CSS3 (Glassmorphism), FontAwesome |
| **Storage** | Flexible JSON (Template for MongoDB/Mongoose) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS recommended)
- [G++ Compiler](https://gcc.gnu.org/) (For compiling analytics source)

### Installation & Launch

1. **Clone the Project**
2. **Install Core Dependencies**
   ```bash
   npm install
   ```
3. **Build the Analytics Engine** (If `.exe` is missing)
   ```bash
   g++ analytics.cpp -o analytics.exe
   ```
4. **Deploy Environment**
   ```bash
   npm start
   ```
5. **Access Application**
   Navigate to `http://localhost:3001`

---

## 📖 API Documentation

### 🔐 Authentication
`POST /login` - Establish a secure session.
```json
{
  "username": "admin",
  "password": "password"
}
```

### 👥 Employee Operations
*All requests require `Authorization: Bearer <token>`*

- `GET /employees` - Retrieve full organizational data.
- `POST /employees` - Register a new professional record.
- `PUT /employees/:id` - Modify existing personnel details.
- `DELETE /employees/:id` - Permanent record deletion.

### 🔬 Native Analytics
`POST /api/cpp-calculate` - Trigger the C++ Analytics Engine.
```json
{
  "salary": 75000
}
```

---

## 📁 Project Structure

```text
├── server.js              # Core Node.js API Gateway
├── analytics.cpp         # C++ Source (Financial Logic)
├── analytics.exe         # Compiled Native Engine
├── employee.js            # Scalable Mongoose Schema Template
├── employees.json        # Intelligent JSON Persistence
└── public/               # UI Layer
    ├── index.html        # Secure Portal
    ├── dashboard.html    # Analytics Command Center
    └── assets/           # Premium Styles & logic
```

---

## 🛡️ Security Best Practices

> - **Session Management**: JWT tokens expire after 1 hour of inactivity.
> - **Data Integrity**: The system validates all inputs before processing via the C++ engine.
> - **Scalability**: While using file-storage by default, the architecture is pre-configured for **MongoDB Atlas** integration.



