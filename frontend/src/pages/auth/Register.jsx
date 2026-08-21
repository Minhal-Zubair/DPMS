import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Phone, IdCard, CheckCircle2 } from "lucide-react";
import API from "../../api/axiosConfig";

const Register = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [strength, setStrength] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    cnic: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    let newErrors = {};

    // First Name
    if (!/^[A-Za-z]{2,30}$/.test(formData.firstName.trim())) {
      newErrors.firstName =
        "First name should contain only letters (2-30 characters).";
    }

    // Last Name
    if (!/^[A-Za-z]{2,30}$/.test(formData.lastName.trim())) {
      newErrors.lastName =
        "Last name should contain only letters (2-30 characters).";
    }

    // CNIC
    if (!/^\d{13}$/.test(formData.cnic)) {
      newErrors.cnic = "CNIC must contain exactly 13 digits.";
    }

    // Email
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // Username
    if (!/^[A-Za-z0-9_]{5,20}$/.test(formData.username)) {
      newErrors.username = "Username must be 5-20 characters with no spaces.";
    }

    // Phone
    if (!/^03\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Phone number should be like 03XXXXXXXXX.";
    }

    // Password
    // Password
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain an uppercase letter.";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must contain a lowercase letter.";
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "Password must contain a number.";
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain a special character.";
    }

    // Confirm Password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // Terms
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "Please accept the Terms & Conditions.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await API.post("/auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        cnic: formData.cnic,
        phone: formData.phone,
        password: formData.password,
      });

      console.log(response.data);

      alert("Registration Successful");

      navigate("/login");
    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data);
      } else {
        alert("Backend Server Not Running");
      }
    }
  };

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.glassCard}
      >
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <User size={40} color="#fff" />
          </div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join the Document Processing System</p>
        </div>

        <form onSubmit={handleRegister} style={styles.form}>
          {/* Name Row */}
          <div style={styles.row}>
            <div style={styles.inputWrapper}>
              <input
                name="firstName"
                type="text"
                placeholder="First Name"
                style={styles.input}
                onChange={handleChange}
                required
              />
              {errors.firstName && (
                <p style={styles.error}>{errors.firstName}</p>
              )}
            </div>
            <div style={styles.inputWrapper}>
              <input
                name="lastName"
                type="text"
                placeholder="Last Name"
                style={styles.input}
                onChange={handleChange}
                required
              />
              {errors.lastName && <p style={styles.error}>{errors.lastName}</p>}
            </div>
          </div>

          {/* CNIC Field (Critical for your project) */}
          <div style={styles.inputGroup}>
            <IdCard size={18} style={styles.fieldIcon} />
            <input
              name="cnic"
              type="text"
              placeholder="CNIC (e.g. 3520212345671)"
              maxLength="13"
              style={styles.fullInput}
              onChange={(e) => {
                handleChange({
                  target: {
                    name: "cnic",
                    value: e.target.value.replace(/\D/g, "").slice(0, 13),
                  },
                });
              }}
              required
            />
            {errors.cnic && <p style={styles.error}>{errors.cnic}</p>}
          </div>

          {/* Email & Username */}
          <div style={styles.inputGroup}>
            <Mail size={18} style={styles.fieldIcon} />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              style={styles.fullInput}
              onChange={handleChange}
              required
            />
            {errors.email && <p style={styles.error}>{errors.email}</p>}
          </div>

          <div style={styles.row}>
            <div style={styles.inputWrapper}>
              <input
                name="username"
                type="text"
                placeholder="Username"
                style={styles.input}
                onChange={handleChange}
                required
              />
              {errors.username && <p style={styles.error}>{errors.username}</p>}
            </div>
            <div style={styles.inputWrapper}>
              <input
                name="phone"
                type="text"
                placeholder="Phone Number"
                style={styles.input}
                onChange={handleChange}
                required
              />
              {errors.phone && <p style={styles.error}>{errors.phone}</p>}
            </div>
          </div>

          {/* Passwords */}
          <div style={styles.inputGroup}>
            <Lock size={18} style={styles.fieldIcon} />
            <input
              name="password"
              type="password"
              placeholder="Password"
              style={styles.fullInput}
              onChange={handleChange}
              required
            />
            {errors.password && <p style={styles.error}>{errors.password}</p>}
          </div>

          <div style={styles.inputGroup}>
            <Lock size={18} style={styles.fieldIcon} />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              style={styles.fullInput}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && (
              <p style={styles.error}>{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms */}
          <div style={styles.termsBox}>
            <input
              name="agreeTerms"
              type="checkbox"
              style={styles.checkbox}
              onChange={handleChange}
              required
            />
            <span style={styles.termsText}>
              I accept the Terms & Conditions
            </span>
            {errors.agreeTerms && (
              <p style={styles.error}>{errors.agreeTerms}</p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            style={styles.registerBtn}
          >
            Create Account
          </motion.button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #ad8458, #3f3c31, #86aebe)",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: "40px 20px",
  },
  glassCard: {
    width: "100%",
    maxWidth: "500px",
    padding: "40px",
    borderRadius: "24px",
    background: "rgba(193, 106, 106, 0.1)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(170, 110, 110, 0.2)",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  iconCircle: {
    width: "80px",
    height: "80px",
    background: "rgba(255, 255, 255, 0.15)",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 15px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  title: {
    color: "#fff",
    fontSize: "50px",
    fontWeight: "700",
    margin: "0",
    letterSpacing: "0.5px",
  },
  subtitle: {
    color: "#b0bec5",
    fontSize: "18px",
    marginTop: "8px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  row: {
    display: "flex",
    gap: "15px",
  },
  inputWrapper: {
    flex: 1,
  },
  inputGroup: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  fieldIcon: {
    position: "absolute",
    left: "15px",
    color: "rgba(196, 171, 171, 0.5)",
  },
  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(169, 122, 122, 0.2)",
    color: "#fefafa",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },
  fullInput: {
    width: "100%",
    padding: "14px 14px 14px 45px",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "#fcf7f7",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },
  termsBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "10px 0",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },
  termsText: {
    color: "#dde3e6",
    fontSize: "13px",
  },
  registerBtn: {
    padding: "16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(90deg, #00c6ff, #0072ff)",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(0, 114, 255, 0.3)",
    marginTop: "10px",
  },
  footer: {
    textAlign: "center",
    color: "#b0bec5",
    fontSize: "14px",
    marginTop: "25px",
  },
  link: {
    color: "#00c6ff",
    textDecoration: "none",
    fontWeight: "600",
  },
  error: {
    color: "#ff6b6b",
    fontSize: "12px",
    marginTop: "6px",
    marginLeft: "5px",
  },
};

export default Register;
