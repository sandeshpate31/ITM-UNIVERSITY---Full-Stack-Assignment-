
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup({ createAccount }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [popup, setPopup] = useState({
    show: false,
    success: false,
    title: "",
    message: "",
  });

 const passwordRules = {
  length: form.password.length >= 8,
  uppercase: /[A-Z]/.test(form.password),
  lowercase: /[a-z]/.test(form.password),
  numberOrSymbol:
    /[0-9]/.test(form.password) ||
    /[^A-Za-z0-9]/.test(form.password),
};

  const passwordIsValid = Object.values(passwordRules).every(Boolean);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: name === "email" ? value : value,
    }));
  }

  function showPopup(success, title, message) {
    setPopup({ show: true, success, title, message });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (Object.values(form).some((value) => !value.trim())) {
      showPopup(
        false,
        "Missing information",
        "Please fill in all the required fields."
      );
      return;
    }

    if (form.name.trim().length < 2) {
      showPopup(
        false,
        "Check your name",
        "Please enter a name with at least 2 characters."
      );
      return;
    }

    const email = form.email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showPopup(
        false,
        "Invalid email",
        "Please enter a valid email address, such as you@example.com."
      );
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      showPopup(
        false,
        "Invalid phone number",
        "Please enter exactly 10 digits."
      );
      return;
    }

    if (!passwordIsValid) {
      showPopup(
        false,
        "Password does not meet requirements",
        "Use at least 8 characters, uppercase and lowercase letters, and at least one number or symbol."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      showPopup(
        false,
        "Passwords don't match",
        "Please make sure both password fields match."
      );
      return;
    }

    if (typeof createAccount !== "function") {
      showPopup(
        false,
        "Setup issue",
        "The  account  is not connected. Please check your Account Details."
      );
      return;
    }

    const result = createAccount({
      name: form.name.trim(),
      email,
      phone: form.phone,
      password: form.password,
    });

    if (result !== "success") {
      showPopup(
        false,
        "Account not created",
        typeof result === "string"
          ? result
          : "We couldn't create your account. Please try again."
      );
      return;
    }

    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });

    showPopup(
      true,
      "Account created successfully!",
      "Your  account is ready. Click Okay to go to the login page."
    );
  }

  function handleOkay() {
    const wasSuccessful = popup.success;

    setPopup({
      show: false,
      success: false,
      title: "",
      message: "",
    });

    if (wasSuccessful) {
      navigate("/login");
    }
  }

  function handlePhoneChange(event) {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 10);

    setForm((previous) => ({
      ...previous,
      phone: digits,
    }));
  }

  return (
    <main className="auth-page">
      <section className="auth-card signup-card">
        <a
          className="auth-logo"
          href="https://www.paypal.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="PayPal official website"
        >
          <img
            src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
            alt="PayPal logo"
            className="paypal-logo"
          />
        </a>

        <p className="eyebrow">CREATE YOUR ACCOUNT</p>
        <h1>Get started today</h1>

        <p className="auth-description">
          Enter your details to create a Account.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            autoComplete="name"
            required
          />

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <label htmlFor="phone">Phone number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={form.phone}
            onChange={handlePhoneChange}
            placeholder="10-digit phone number"
            autoComplete="tel"
            required
          />

          <label htmlFor="password">Create password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a strong password"
            autoComplete="new-password"
            required
          />

          <div className="password-rules">
            <p className="password-rules-title">Your password must have:</p>

            <p className={passwordRules.length ? "rule-valid" : "rule"}>
              <span>{passwordRules.length ? "✓" : "○"}</span>
              8 characters or more
            </p>

            <p className={passwordRules.uppercase ? "rule-valid" : "rule"}>
              <span>{passwordRules.uppercase ? "✓" : "○"}</span>
              At least one uppercase letter (A–Z)
            </p>

            <p className={passwordRules.lowercase ? "rule-valid" : "rule"}>
              <span>{passwordRules.lowercase ? "✓" : "○"}</span>
              At least one lowercase letter (a–z)
            </p>

            <p
              className={
                passwordRules.numberOrSymbol ? "rule-valid" : "rule"
              }
            >
              <span>{passwordRules.numberOrSymbol ? "✓" : "○"}</span>
              At least one number or symbol (!@#$%^)
            </p>
          </div>

          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Enter your password again"
            autoComplete="new-password"
            required
          />

          <button className="primary-button" type="submit">
            Create  Account
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>

       

        
      </section>

      {popup.show && (
        <div className="popup-overlay">
          <section
            className="popup-card"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="signup-popup-title"
            aria-describedby="signup-popup-message"
          >
            <div
              className={`popup-icon ${
                popup.success ? "popup-success" : "popup-error"
              }`}
            >
              {popup.success ? "✓" : "!"}
            </div>

            <h2 id="signup-popup-title">{popup.title}</h2>
            <p id="signup-popup-message">{popup.message}</p>

            <button
              className="primary-button popup-button"
              type="button"
              onClick={handleOkay}
              autoFocus
            >
              Okay
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

export default Signup;
