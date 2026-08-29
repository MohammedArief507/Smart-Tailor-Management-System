import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import AuthLayout from "../layouts/AuthLayout";
import FormInput from "../components/FormInput";
import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import getErrorMessage from "../utils/getErrorMessage";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.email || !formData.password) {
      setFormError("Please enter your email and password");
      return;
    }

    setIsLoading(true);
    try {
      await login(formData);
      navigate("/dashboard");
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to manage your shop">
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          icon={<HiOutlineMail />}
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          icon={<HiOutlineLockClosed />}
        />

        {formError && (
          <p className="text-sm text-danger bg-danger/10 rounded-btn px-3 py-2 mb-4">
            {formError}
          </p>
        )}

        <PrimaryButton type="submit" isLoading={isLoading}>
          Log In
        </PrimaryButton>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary font-semibold">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
