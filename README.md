# 🎓 GPA Calculator Web App

A full-featured **GPA & CGPA Calculator** built with **React**, **Firebase**, **Zustand**, **Formik**, and **Yup**.  
The application includes **authentication**, **protected routes**, **Firestore data storage**, and **edit functionality** for calculated GPA records.

---

## 🚀 Features

### 🔑 Authentication
- **Sign Up** with Username, Email, Password, and Confirm Password
- **Login** with Firebase Authentication
- **Forgot Password** with email-based reset link
- **Email Verification** before accessing dashboard
- Passwords must have **at least 6 characters**
- **Formik** & **Yup** validation for all forms
- User credentials saved in **Firebase Firestore**
- Password updates reflect in both Authentication and Firestore

### 📊 GPA & CGPA Dashboard
- **Protected Route** using Zustand
- **Two calculators**:
  1. **SGPA Calculator**: Semester, Subject Name, Credit Hours, Marks
  2. **CGPA Calculator**: Semester, Subject Name, Credit Hours, SGPA
- **Student Name** required for GPA calculation
- Add multiple subjects dynamically (minimum **6** required)
- Delete individual subjects or reset all at once
- **Edit button** next to calculated GPA:
  - Opens the entered subjects back in the form
  - Allows modifying marks, credit hours, subjects, etc.
  - Updates GPA in Firestore after saving changes

### 🔒 Data Privacy
- GPA data saved under **user ID** in Firestore
- Each student only sees **their own GPA records**
- Firestore Security Rules enforce **user-specific access**

---

## 🛠 Tech Stack

| Technology        | Purpose                              |
|-------------------|--------------------------------------|
| **React**         | Frontend framework                   |
| **Firebase Auth** | Authentication & Email Verification  |
| **Firestore**     | Cloud database for GPA records       |
| **Zustand**       | State management                     |
| **Formik**        | Form handling                        |
| **Yup**           | Schema-based form validation         |

---

## 📂 Project Structure

gpa-calculator/
│── src/
│ ├── components/
│ │ ├── Auth/
│ │ │ ├── Login.jsx
│ │ │ ├── Signup.jsx
│ │ │ ├── ForgotPassword.jsx
│ │ │ └── EmailVerification.jsx
│ │ ├── Dashboard/
│ │ │ ├── SGPAForm.jsx
│ │ │ ├── CGPAForm.jsx
│ │ │ └── GPAList.jsx
│ │ └── ProtectedRoute.jsx
│ ├── context/
│ │ └── store.js (Zustand)
│ ├── firebase.js
│ ├── App.jsx
│ └── index.js
│── public/
│── package.json
│── README.md


---

## 📐 GPA Calculation Logic

### **SGPA Formula**

SGPA = (Σ (Credit Hours × Grade Points)) ÷ (Σ Credit Hours)

### **CGPA Formula**

CGPA = (Σ (Credit Hours × SGPA)) ÷ (Σ Credit Hours)

---

## 📸 Screenshots (Optional)
_Add your screenshots or GIF demos here once developed._

---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/gpa-calculator.git

# Navigate to project folder
cd gpa-calculator

# Install dependencies
npm install

# Start the development server
npm start

