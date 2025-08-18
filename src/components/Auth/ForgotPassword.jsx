import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useAuthStore } from "../../context/store";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { setError } = useAuthStore();
  const [authError, setAuthError] = useState("");
  const [success, setSuccess] = useState("");

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
  });

  const onSubmit = async (values) => {
    try {
      await sendPasswordResetEmail(auth, values.email);
      setSuccess("Password reset email has been sent. Check your inbox");
      setAuthError("");
      setError(""); // Clear any previous errors
    } catch (error) {
      setAuthError(error.message);
      setError(error.message);
      setSuccess("");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Reset Password</h2>
      {authError && <div className="error-message">{authError}</div>}
      {success && <div className="success-message">{success}</div>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Reset Password"}
            </button>
          </Form>
        )}
      </Formik>
      <div className="auth-nav">
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;