import React from "react";

const Forgot = () => {
  const [email, setEmail] = useState("");

  return (
    <div>
      Forgot your password? Enter your email to change your password.
      <form>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </form>
    </div>
  );
};

export default Forgot;
