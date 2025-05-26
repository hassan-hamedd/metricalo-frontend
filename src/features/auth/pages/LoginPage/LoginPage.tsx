import { Navigate } from "react-router-dom";
import Card from "../../../../components/ui/Card/Card";
import Button from "../../../../components/ui/Button/Button";
import Logo from "../../../../components/ui/Logo";
import useAuth from "../../../../hooks/useAuth";
import useLoginForm from "../../../../hooks/useLoginForm";
import styles from "./LoginPage.module.scss";

export const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    error,
    handleSubmit,
  } = useLoginForm();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <Logo width={200} height={30} />
          <p>Billing Dashboard</p>
        </div>

        <Card>
          <Card.Body>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                />
              </div>

              {error && <div className={styles.errorMessage}>{error}</div>}

              <Button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <a href="#" className={styles.forgotPassword}>
              Forgot your password?
            </a>
          </Card.Body>
        </Card>

        <div
          className="text-center mt-3"
          style={{ fontSize: "0.875rem", color: "#6c757d" }}
        >
          <p>Demo credentials are pre-filled for you.</p>
          <p>Just click "Sign In" to continue.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
