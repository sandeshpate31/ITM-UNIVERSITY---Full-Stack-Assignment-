import  { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [activeTab, setActiveTab] = useState("Business");

  return (
    <main className="home">
      <div className="toggle">
        <button
          type="button"
          className={activeTab === "Personal" ? "toggle-active" : ""}
          onClick={() => setActiveTab("Personal")}
        >
          Personal
        </button>

        <button
          type="button"
          className={activeTab === "Business" ? "toggle-active" : ""}
          onClick={() => setActiveTab("Business")}
        >
          Business
        </button>
      </div>

      <section className="hero">
        <h1>PayPal Open</h1>

        <h2>One platform for your business needs</h2>

        <p>
          PayPal Open unifies your PayPal business solutions to help
          you get paid, get growing, and get ahead.
        </p>

        <div className="hero-buttons">
          <Link to="/signup" className="btn btn-dark">
            Sign Up
          </Link>

          <a
            href="https://www.paypal.com/in/home"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-light"
          >
            Contact Sales
          </a>
        </div>
      </section>
    </main>
  );
}

export default Home;