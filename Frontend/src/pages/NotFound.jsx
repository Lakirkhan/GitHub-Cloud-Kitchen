import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <p>Maybe what you're looking for is on another page?</p>
      <input type="text" placeholder="Search for something..." />
      <br />
      <Link to="/" style={{ textDecoration: "none", color: "blue" }}>
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;
