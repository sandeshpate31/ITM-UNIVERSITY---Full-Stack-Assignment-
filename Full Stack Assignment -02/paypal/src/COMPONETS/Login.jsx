
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState({
    show: false,
    success: false,
    title: "",
    message: "",
  });

  function handleSubmit(event) {
    event.preventDefault();

    const value = identifier.trim();

    if (!value || !password) {
      setPopup({
        show: true,
        success: false,
        title: "Missing information",
        message: "Please enter your email/phone number and password.",
      });
      return;
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const validPhone = /^\d{10}$/.test(value);

    if (!validEmail && !validPhone) {
      setPopup({
        show: true,
        success: false,
        title: "Invalid details",
        message: "Enter a valid email address or a 10-digit phone number.",
      });
      return;
    }

    // Demo only: this checks input format, not a real account or password.
    setPopup({
      show: true,
      success: true,
      title: "Login successful!",
      message: "Your demo login was successful. Welcome back!",
    });
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
      navigate("/");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card login-card">
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

        <p className="eyebrow">WELCOME BACK</p>
        <h1>Log in to your account</h1>

        <p className="auth-description">
          Sign in to your PayPal Account
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="identifier">
            Email address or phone number
          </label>

          <input
            id="identifier"
            type="text"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="Email address or phone number"
            autoComplete="username"
            required
          />

          <label htmlFor="loginPassword">Password</label>

          <input
            id="loginPassword"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          <button className="primary-button" type="submit">
            Log In
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>

       

        
      </section>

      {popup.show && (
        <div className="popup-overlay">
          <section
            className="popup-card"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="login-popup-title"
            aria-describedby="login-popup-message"
          >
            <div
              className={`popup-icon ${
                popup.success ? "popup-success" : "popup-error"
              }`}
            >
              {popup.success ? "✓" : "!"}
            </div>

            <h2 id="login-popup-title">{popup.title}</h2>
            <p id="login-popup-message">{popup.message}</p>

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

export default Login;
