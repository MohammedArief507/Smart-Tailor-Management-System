import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineOfficeBuilding,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLogout,
  HiOutlinePencil,
  HiOutlineCog,
  HiOutlineInformationCircle,
  HiChevronRight,
} from "react-icons/hi";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../services/authService";
import getErrorMessage from "../utils/getErrorMessage";

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    shopName: user?.shopName || "",
    ownerName: user?.ownerName || "",
    phone: user?.phone || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setFormData({
      shopName: user?.shopName || "",
      ownerName: user?.ownerName || "",
      phone: user?.phone || "",
    });
    setError("");
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.shopName.trim() || !formData.ownerName.trim() || !formData.phone.trim()) {
      setError("Please fill all the fields");
      return;
    }
    setError("");
    setIsSaving(true);
    try {
      const updatedUser = await updateProfile(formData);
      updateUser(updatedUser);
      setIsEditing(false);
      setSuccessMessage("Profile updated");
      setTimeout(() => setSuccessMessage(""), 2500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <MainLayout showFab={false}>
      <h1 className="text-lg font-bold text-textmain dark:text-card mb-4">Profile</h1>

      <div className="bg-white dark:bg-[#1A2020] rounded-card shadow-softer p-4 mb-4">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <label className="block mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
              Shop Name
            </label>
            <input
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              className="w-full h-11 px-3 mb-3 rounded-btn bg-background dark:bg-[#121717] text-sm text-textmain dark:text-card focus:outline-none focus:ring-2 focus:ring-primary/40"
            />

            <label className="block mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
              Owner Name
            </label>
            <input
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              className="w-full h-11 px-3 mb-3 rounded-btn bg-background dark:bg-[#121717] text-sm text-textmain dark:text-card focus:outline-none focus:ring-2 focus:ring-primary/40"
            />

            <label className="block mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
              Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-11 px-3 mb-3 rounded-btn bg-background dark:bg-[#121717] text-sm text-textmain dark:text-card focus:outline-none focus:ring-2 focus:ring-primary/40"
            />

            {error && <p className="text-xs text-danger mb-3">{error}</p>}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 h-11 rounded-btn bg-background dark:bg-[#121717] text-sm font-semibold text-textmain dark:text-card"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 h-11 rounded-btn bg-primary text-white text-sm font-semibold disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <HiOutlineOfficeBuilding className="text-2xl" />
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 px-3 h-9 rounded-btn bg-primary/10 text-primary text-xs font-semibold"
              >
                <HiOutlinePencil /> Edit
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <HiOutlineOfficeBuilding className="text-gray-400 text-lg shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Shop Name</p>
                  <p className="text-sm font-medium text-textmain dark:text-card">
                    {user?.shopName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlineUser className="text-gray-400 text-lg shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Owner Name</p>
                  <p className="text-sm font-medium text-textmain dark:text-card">
                    {user?.ownerName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlinePhone className="text-gray-400 text-lg shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
                  <p className="text-sm font-medium text-textmain dark:text-card">
                    {user?.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlineMail className="text-gray-400 text-lg shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm font-medium text-textmain dark:text-card">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {successMessage && (
        <p className="text-sm text-success bg-success/10 rounded-btn px-3 py-2 mb-4">
          {successMessage}
        </p>
      )}

      {!isEditing && (
        <>
          <div className="bg-white dark:bg-[#1A2020] rounded-card shadow-softer mb-4 overflow-hidden">
            <button
              onClick={() => navigate("/settings")}
              className="w-full flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-gray-800"
            >
              <span className="flex items-center gap-3 text-sm font-medium text-textmain dark:text-card">
                <HiOutlineCog className="text-lg text-gray-400" />
                Settings
              </span>
              <HiChevronRight className="text-gray-300" />
            </button>
            <button
              onClick={() => navigate("/about")}
              className="w-full flex items-center justify-between px-4 py-3.5"
            >
              <span className="flex items-center gap-3 text-sm font-medium text-textmain dark:text-card">
                <HiOutlineInformationCircle className="text-lg text-gray-400" />
                About
              </span>
              <HiChevronRight className="text-gray-300" />
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full h-12 rounded-btn bg-danger/10 text-danger font-semibold flex items-center justify-center gap-2"
          >
            <HiOutlineLogout className="text-lg" />
            Logout
          </button>
        </>
      )}
    </MainLayout>
  );
};

export default Profile;
