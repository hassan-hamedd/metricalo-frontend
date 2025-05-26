import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import type { LoginRequest } from "../types/auth";

/**
 * Custom hook for managing login form state and submission
 */
export const useLoginForm = () => {
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("metricalo");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      const credentials: LoginRequest = { email, password };
      const success = await login(credentials);
      
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    error,
    handleSubmit,
  };
};

export default useLoginForm; 