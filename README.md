# Smart Hostel Complaint Management System

A fullstack web application divided into two clear parts:
- **Frontend**: React (Vite)
- **Backend**: Node.js & Express (HTTP Communication Protocol)

---

## 🚀 How to Run the Project

### Step 1: Start Backend (Node.js)
```bash
cd backend
npm install
npm start
```
> Server runs on **http://localhost:5000**

### Step 2: Start Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
> App runs on **http://localhost:5173**

---

## 🔑 Login Accounts (Direct Credentials)

| Role | Email / Staff ID | Password | Name |
|---|---|---|---|
| **👨‍🎓 Student** | `demo@student.com` | `1234` | Demo Student |
| **🛠️ Staff (Suresh)** | `suresh@staff.com` | `1234` | Suresh Singh |
| **🛠️ Staff (Ramesh)** | `ramesh@staff.com` | `1234` | Ramesh Kumar |
| **🛠️ Staff (Anita)** | `anita@staff.com` | `1234` | Anita Sharma |
| **🛠️ Staff (Vikas)** | `vikas@staff.com` | `1234` | Vikas Yadav |
| **👑 Admin** | `admin@hostel.com` | `1234` | Hostel Admin |

*(New students can also register on the `/signup` page).*

---

## 🔄 Complete Complaint Workflow

1. **Student Lodges Complaint**:
   - Student enters **Title**, **Category**, **Room No. / Place 📍** (e.g. `Room 204, Block B`), and **Description**.
   - Complaint is registered with status `Pending`.

2. **Admin Assigns Staff**:
   - Admin sees the complaint with student details and room location.
   - Admin picks a staff member (e.g. Suresh Singh) and clicks **"Assign"**. Status becomes `Assigned`.

3. **Staff Logs In & Views Tasks**:
   - Staff logs in using their own email (`suresh@staff.com` / `1234`).
   - Staff dashboard shows assigned complaints with **Problem Details**, **📍 Room No. / Location**, and contact info.

4. **Staff Completes Work**:
   - Staff types their resolution note/remark (e.g. *"Replaced burned socket"*).
   - Staff clicks **"✅ Mark Completed"**. Status changes to `Work Completed`.

5. **Admin Verifies & Resolves**:
   - Admin dashboard highlights the complaint as `Work Completed` and shows staff's remark.
   - Admin clicks **"✅ Verify & Resolve"**. Status changes to `Resolved`.
   - Student sees the issue as `Resolved` with staff's resolution note!
