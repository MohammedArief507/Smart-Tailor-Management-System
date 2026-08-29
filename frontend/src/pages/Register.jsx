import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineOfficeBuilding,
} from "react-icons/hi";
import AuthLayout from "../layouts/AuthLayout";
import FormInput from "../components/FormInput";
import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import getErrorMessage from "../utils/getErrorMessage";

const initialFormState = {
  shopName: "",
  ownerName: "",
  phone: "",
  email: "",
  password: "",
};

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (Object.values(formData).some((value) => !value.trim())) {
      return "Please fill all the fields";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError("");
    setIsLoading(true);
    try {
      await register(formData);
      navigate("/dashboard");
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Set up your shop in a minute">
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Shop Name"
          name="shopName"
          value={formData.shopName}
          onChange={handleChange}
          placeholder="e.g. Lakshmi Tailors"
          icon={<HiOutlineOfficeBuilding />}
        />
        <FormInput
          label="Owner Name"
          name="ownerName"
          value={formData.ownerName}
          onChange={handleChange}
          placeholder="Your full name"
          icon={<HiOutlineUser />}
        />
        <FormInput
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="10-digit mobile number"
          icon={<HiOutlinePhone />}
        />
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
          placeholder="At least 6 characters"
          icon={<HiOutlineLockClosed />}
        />

        {formError && (
          <p className="text-sm text-danger bg-danger/10 rounded-btn px-3 py-2 mb-4">
            {formError}
          </p>
        )}

        <PrimaryButton type="submit" isLoading={isLoading}>
          Create Account
        </PrimaryButton>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-semibold">
          Log In
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
