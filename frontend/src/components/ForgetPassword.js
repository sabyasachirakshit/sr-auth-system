// src/components/ForgotPassword.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const Error = styled.p`
  color: red;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [errors, setErrors] = useState({});
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [showSecurityQuestion, setShowSecurityQuestion] = useState(false);

  const handleFetchSecurityQuestion = async () => {
    // Fetch security question from backend
    const response = await fetch(
      "http://localhost:5000/api/auth/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      setSecurityQuestion(data.securityQuestion);
      setShowSecurityQuestion(true);
    } else {
      alert(data.msg);
      console.log(data.msg);
    }
  };

  const validate = (data) => {
    let errors = {};
    if (!data) errors.password = "Password is required";
    else if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,}$/.test(data)
    ) {
      errors.password =
        "Password must be at least 10 characters long, contain a number, an uppercase letter, a special character, and no spaces";
    } else if (data !== newConfirmPassword) {
      errors.confirmPass = "Passwords do not match!";
    }
    return errors;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    // Handle password reset logic here
    const errors = validate(newPassword);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      const response = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, securityAnswer, newPassword }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert(data.msg);
        console.log(data.msg);
        navigate("/login");
      } else {
        alert(data.msg);
        console.log(data.msg);
      }
    }
  };

  return (
    <Container>
      <Form onSubmit={handleResetPassword}>
        <h2>Forgot Password</h2>
        {!showSecurityQuestion ? (
          <>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button type="button" onClick={handleFetchSecurityQuestion}>
              Next
            </Button>
          </>
        ) : (
          <>
            <p>{securityQuestion}</p>
            <Input
              type="text"
              placeholder="Security Answer"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
            />
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {errors.password && <Error>{errors.password}</Error>}
            <Input
              type="password"
              placeholder="Confirm Password"
              value={newConfirmPassword}
              onChange={(e) => setNewConfirmPassword(e.target.value)}
            />
            {errors.confirmPass && <Error>{errors.confirmPass}</Error>}
            <Button type="submit">Reset Password</Button>
          </>
        )}
      </Form>
    </Container>
  );
};

export default ForgotPassword;
