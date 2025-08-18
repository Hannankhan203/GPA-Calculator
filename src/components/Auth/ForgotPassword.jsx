import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
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
      setSuccess("Password reset email sent. Check your inbox.");
      setAuthError("");
    } catch (error) {
      setAuthError(error.message);
      setError(error.message);
      setSuccess("");
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2 className="forgot-password-title">Forgot Password</h2>
        {authError && <div className="auth-error-message">{authError}</div>}
        {success && <div className="auth-success-message">{success}</div>}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="forgot-password-form">
              <div className="form-group">
                <label className="form-label">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Reset Password"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="back-to-login">
          <Link to="/login" className="back-link">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
