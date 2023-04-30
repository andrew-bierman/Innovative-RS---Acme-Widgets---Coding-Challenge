import React from "react";

export const Header = () => {
  return (
    <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <span className="has-text-weight-bold" style={{ fontSize: "24px" }}>
            ACME&nbsp;
          </span>
          <span className="has-text-weight-light" style={{ fontSize: "20px" }}>
            Widgets
          </span>
        </a>
      </div>
    </nav>
  );
};
