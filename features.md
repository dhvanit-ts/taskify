# Features

Without using chatgpt 

Features to Build:
### 1. User Authentication
- Signup / Login (JWT-based)
- Password encryption with bcrypt
- Profile page (view/update user info)

### 2. Boards & Teams
- Create a board (e.g., "Marketing Sprint")
- Add/remove members by email
- Role-based access (Admin, Member)

### 3. Task Management
- Add/Edit/Delete tasks
- Drag & drop task between columns (To Do / In - Progress / Done)
- Assign task to a member
- Due dates & priority levels

### 4. Real-Time Notifications
- When a task is updated, assigned, or moved →
- notify via Socket.IO
- Show real-time user presence in a board

### 5. Activity Log (Optional)
- Timeline of actions (e.g., "Mehnaz moved Task A to 'In Progress'")

---
### Tech Stack
- Frontend (React) Requirements:
- Responsive UI with Tailwind CSS
- Reusable components (Card, Modal, TaskList)
- Use Context API or Redux Toolkit for state
- Use react-beautiful-dnd for drag-and-drop
---
- Backend (Node/Express) Requirements:
- RESTful APIs for users, boards, tasks
- MongoDB models with relationships:
- User ↔ Boards (many-to-many)
- Board ↔ Tasks (one-to-many)
- Input validation (Joi or express-validator)
- Error handling middleware
 