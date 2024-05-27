// src/components/Login.js
import React, { useState,useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
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









const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setRedirectToDashboard(true); // Set state to trigger redirect
      return;
    }
  }, [])

  if (redirectToDashboard) {
    navigate('/dashboard'); // Perform the redirect
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username,
      password
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Logged in successfully', data);
        localStorage.setItem('token', data.token); // Store the token
        navigate('/dashboard') // Redirect to dashboard
      } else {
        console.log('Login failed', data);
        // Handle login failure (e.g., display error message)
      }
    } catch (err) {
      console.error('Error:', err);
      // Handle error (e.g., display error message)
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Login</Button>
      </Form>
    </Container>
  );
};

export default Login;
