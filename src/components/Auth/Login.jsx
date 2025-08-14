import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword } from "../../firebase";
import { useAuthStore } from "../../context/store";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setError } = useAuthStore();
  const [authError, setAuthError] = useState("");

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  const onSubmit = async (values) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      setUser(userCredential.user);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      setAuthError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>
      {authError && <div className="error-message">{authError}</div>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" />
          </div>
          <button type="submit">Login</button>
        </Form>
      </Formik>
      <div className="reset-link">
        <Link to="/forgot-password">Forgot Password</Link>
      </div>
      <div className="signup">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
};

export default Login;
