import { useState } from "react";
import axios from "axios";
import {
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
} from "lucide-react";
import "./ChangePassword.css";

function ChangePassword() {

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  /* ===========================
      Toggle Password Visibility
  =========================== */

  const togglePassword = (field) => {

    setShowPassword((prev) => ({

      ...prev,

      [field]: !prev[field],

    }));

  };

  /* ===========================
      Password Requirements
  =========================== */

  const requirements = {

    length: formData.newPassword.length >= 8,

    upper: /[A-Z]/.test(formData.newPassword),

    lower: /[a-z]/.test(formData.newPassword),

    number: /\d/.test(formData.newPassword),

    special: /[!@#$%^&*(),.?":{}|<>]/.test(
      formData.newPassword
    ),

  };

  /* ===========================
      Password Strength
  =========================== */

  const getStrength = () => {

    let score = 0;

    Object.values(requirements).forEach((item) => {

      if (item) score++;

    });

    if (score <= 2)

      return {

        label: "Weak",

        color: "#DC2626",

        width: "25%",

      };

    if (score === 3)

      return {

        label: "Fair",

        color: "#F59E0B",

        width: "50%",

      };

    if (score === 4)

      return {

        label: "Good",

        color: "#2563EB",

        width: "75%",

      };

    return {

      label: "Strong",

      color: "#16A34A",

      width: "100%",

    };

  };

  const strength = getStrength();

  /* ===========================
      Input Change
  =========================== */

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({

      ...prev,

      [name]: value,

    }));

    setErrors((prev) => ({

      ...prev,

      [name]: "",

    }));

    setSuccess("");

  };

  /* ===========================
      Validation
  =========================== */

  const validate = () => {

    const newErrors = {};

    if (!formData.currentPassword.trim())

      newErrors.currentPassword =
        "Current password is required.";

    else if (
      formData.currentPassword.length < 8
    )

      newErrors.currentPassword =
        "Current password is invalid.";

    if (!formData.newPassword.trim())

      newErrors.newPassword =
        "New password is required.";

    else {

      if (!requirements.length)

        newErrors.newPassword =
          "Password must be at least 8 characters.";

      else if (!requirements.upper)

        newErrors.newPassword =
          "Password needs one uppercase letter.";

      else if (!requirements.lower)

        newErrors.newPassword =
          "Password needs one lowercase letter.";

      else if (!requirements.number)

        newErrors.newPassword =
          "Password needs one number.";

      else if (!requirements.special)

        newErrors.newPassword =
          "Password needs one special character.";

      else if (
        formData.newPassword ===
        formData.currentPassword
      )

        newErrors.newPassword =
          "New password cannot be the same as current password.";

    }

    if (!formData.confirmPassword.trim())

      newErrors.confirmPassword =
        "Please confirm your password.";

    else if (
      formData.newPassword !==
      formData.confirmPassword
    )

      newErrors.confirmPassword =
        "Passwords do not match.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };

  /* ===========================
      Submit
  =========================== */

  const handleSubmit = async () => {

    console.log("Button Clicked");

    if (!validate()) return;

    try {

        const userId = Number(localStorage.getItem("userId"));

        const response = await axios.put(
            "http://localhost:8080/api/users/change-password",
            {
                userId,
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            }
        );

        setSuccess(response.data);

        setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });

    } catch (error) {

        if (error.response) {

            setErrors({
                currentPassword: error.response.data
            });

        } else {

            alert("Server Error");

        }

    }

};

   

  const isFormValid =
    formData.currentPassword &&
    formData.newPassword &&
    formData.confirmPassword &&
    Object.values(requirements).every(Boolean) &&
    formData.newPassword ===
      formData.confirmPassword;
        return (
    <div className="change-password-page">

      <div className="page-header">

        <h1>Change Password</h1>

        <p>
          Update your account password securely.
        </p>

      </div>

      <div className="password-card">

        {success && (
          <div className="success-box">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        {/* Current Password */}

        <div className="input-group">

          <label>Current Password</label>

          <div className="password-wrapper">

            <input
              type={
                showPassword.current
                  ? "text"
                  : "password"
              }
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                togglePassword("current")
              }
            >
              {showPassword.current ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

          <span className="error">
            {errors.currentPassword}
          </span>

        </div>

        {/* New Password */}

        <div className="input-group">

          <label>New Password</label>

          <div className="password-wrapper">

            <input
              type={
                showPassword.new
                  ? "text"
                  : "password"
              }
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                togglePassword("new")
              }
            >
              {showPassword.new ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

          <span className="error">
            {errors.newPassword}
          </span>

          {/* Strength */}

          {formData.newPassword && (

            <>

              <div className="strength-bar">

                <div
                  className="strength-fill"
                  style={{
                    width: strength.width,
                    background: strength.color,
                  }}
                />

              </div>

              <div
                className="strength-text"
                style={{
                  color: strength.color,
                }}
              >
                Password Strength :
                <strong>
                  {" "}
                  {strength.label}
                </strong>
              </div>

            </>

          )}

          {/* Live Requirements */}

          <div className="requirements">

            <div>

              {requirements.length ? (
                <CheckCircle
                  className="valid"
                  size={18}
                />
              ) : (
                <XCircle
                  className="invalid"
                  size={18}
                />
              )}

              <span>
                At least 8 characters
              </span>

            </div>

            <div>

              {requirements.upper ? (
                <CheckCircle
                  className="valid"
                  size={18}
                />
              ) : (
                <XCircle
                  className="invalid"
                  size={18}
                />
              )}

              <span>
                One uppercase letter
              </span>

            </div>

            <div>

              {requirements.lower ? (
                <CheckCircle
                  className="valid"
                  size={18}
                />
              ) : (
                <XCircle
                  className="invalid"
                  size={18}
                />
              )}

              <span>
                One lowercase letter
              </span>

            </div>

            <div>

              {requirements.number ? (
                <CheckCircle
                  className="valid"
                  size={18}
                />
              ) : (
                <XCircle
                  className="invalid"
                  size={18}
                />
              )}

              <span>
                One number
              </span>

            </div>

            <div>

              {requirements.special ? (
                <CheckCircle
                  className="valid"
                  size={18}
                />
              ) : (
                <XCircle
                  className="invalid"
                  size={18}
                />
              )}

              <span>
                One special character
              </span>

            </div>

          </div>

        </div>

        {/* Confirm Password */}

        <div className="input-group">

          <label>Confirm Password</label>

          <div className="password-wrapper">

            <input
              type={
                showPassword.confirm
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                togglePassword("confirm")
              }
            >
              {showPassword.confirm ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

          <span className="error">
            {errors.confirmPassword}
          </span>

        </div>

        <button
          className="save-btn"
          disabled={!isFormValid}
          onClick={handleSubmit}
        >
          Update Password
        </button>

      </div>

    </div>
  );

}

export default ChangePassword;