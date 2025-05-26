import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { MouseEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import styles from "./AppLayout.module.scss";
import Logo from "../../ui/Logo";
import { 
  FiMenu, FiX, FiGrid, FiDollarSign, FiUsers, 
  FiBarChart2, FiSettings, FiUser, FiLogOut 
} from "react-icons/fi";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleUserMenuToggle = (e: MouseEvent) => {
    e.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className="d-flex align-items-center">
          <button
            className={styles.menuButton}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <FiMenu />
          </button>
          <Link to="/dashboard" className={styles.logo}>
            <Logo />
          </Link>
        </div>

        <div className={styles.userMenu}>
          <button className={styles.userButton} onClick={handleUserMenuToggle}>
            <img
              src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`}
              alt={`${user?.firstName} ${user?.lastName}`}
            />
            <span>
              {user?.firstName} {user?.lastName}
            </span>
          </button>

          <div
            className={`${styles.userDropdown} ${
              isUserMenuOpen ? styles.open : ""
            }`}
          >
            <div className={styles.userMenuHeader}>
              <h4>
                {user?.firstName} {user?.lastName}
              </h4>
              <p>{user?.email}</p>
            </div>
            <ul className={styles.userMenuItems}>
              <li>
                <Link to="/profile">
                  <FiUser />
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/settings">
                  <FiSettings />
                  Settings
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>
                  <FiLogOut />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <div className={styles.main}>
        {/* Desktop Sidebar */}
        <aside className={styles.sidebar}>
          <nav>
            <ul className={styles.nav}>
              <li className={styles.navItem}>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ""}`
                  }
                >
                  <FiGrid />
                  Dashboard
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink
                  to="/transactions"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ""}`
                  }
                >
                  <FiDollarSign />
                  Transactions
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink
                  to="/customers"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ""}`
                  }
                >
                  <FiUsers />
                  Customers
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink
                  to="/reports"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ""}`
                  }
                >
                  <FiBarChart2 />
                  Reports
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ""}`
                  }
                >
                  <FiSettings />
                  Settings
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        <div
          className={`${styles.overlay} ${isMobileMenuOpen ? styles.open : ""}`}
          onClick={toggleMobileMenu}
        ></div>
        <aside
          className={`${styles.sidebarMobile} ${
            isMobileMenuOpen ? styles.open : ""
          }`}
        >
          <button
            className={styles.closeButton}
            onClick={toggleMobileMenu}
            aria-label="Close menu"
          >
            <FiX />
          </button>
          <nav>
            <ul className={styles.nav}>
              <li className={styles.navItem}>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ""}`
                  }
                  onClick={toggleMobileMenu}
                >
                  <FiGrid />
                  Dashboard
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink
                  to="/transactions"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ""}`
                  }
                  onClick={toggleMobileMenu}
                >
                  <FiDollarSign />
                  Transactions
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink
                  to="/customers"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ""}`
                  }
                  onClick={toggleMobileMenu}
                >
                  <FiUsers />
                  Customers
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink
                  to="/reports"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ""}`
                  }
                  onClick={toggleMobileMenu}
                >
                  <FiBarChart2 />
                  Reports
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ""}`
                  }
                  onClick={toggleMobileMenu}
                >
                  <FiSettings />
                  Settings
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
