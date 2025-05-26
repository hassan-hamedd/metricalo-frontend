import type { Transaction } from "../../../../types/dashboard";
import { formatDate, formatCurrency } from "../../../../utils/formatters";
import styles from "./TransactionList.module.scss";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useEffect, useState } from "react";

export interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
}

export const TransactionList = ({
  transactions,
  isLoading = false,
  pagination,
  onPageChange,
}: TransactionListProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const { page, totalPages } = pagination;
    const pageButtons = [];

    // Previous button
    pageButtons.push(
      <button
        key="prev"
        className={styles.navButton}
        onClick={() => onPageChange?.(page - 1)}
        disabled={page === 1 || isLoading}
        aria-label="Previous page"
      >
        <FiChevronLeft />
        <span>Prev</span>
      </button>
    );

    // Page numbers
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          className={page === i ? styles.active : ""}
          onClick={() => onPageChange?.(i)}
          disabled={isLoading}
        >
          {i}
        </button>
      );
    }

    // Next button
    pageButtons.push(
      <button
        key="next"
        className={styles.navButton}
        onClick={() => onPageChange?.(page + 1)}
        disabled={page === totalPages || isLoading}
        aria-label="Next page"
      >
        <span>Next</span>
        <FiChevronRight />
      </button>
    );

    return <div className={styles.pagination}>{pageButtons}</div>;
  };

  if (isLoading) {
    return <div className={styles.noData}>Loading transactions...</div>;
  }

  if (!transactions.length) {
    return <div className={styles.noData}>No transactions found</div>;
  }

  return (
    <>
      <div className={styles.container}>
        {isMobile ? (
          <div className={styles.mobileCards}>
            {transactions.map((transaction) => (
              <div className={styles.card} key={transaction.id}>
                <div className={styles.cardHeader}>
                  <span className={styles.reference}>{transaction.reference}</span>
                  <span
                    className={`${styles.status} ${styles[transaction.status]}`}
                  >
                    {transaction.status}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardRow}>
                    <span className={styles.label}>Date</span>
                    <span className={styles.date}>{formatDate(transaction.date)}</span>
                  </div>
                  <div className={styles.cardRow}>
                    <span className={styles.label}>Customer</span>
                    <span>{transaction.customerName}</span>
                  </div>
                  <div className={styles.cardRow}>
                    <span className={styles.label}>Payment Method</span>
                    <span>{transaction.paymentMethod}</span>
                  </div>
                  <div className={styles.cardRow}>
                    <span className={styles.label}>Amount</span>
                    <span className={styles.amount}>{formatCurrency(transaction.amount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.reference}</td>
                  <td className={styles.date}>{formatDate(transaction.date)}</td>
                  <td>{transaction.customerName}</td>
                  <td>{transaction.paymentMethod}</td>
                  <td className={styles.amount}>
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td>
                    <span
                      className={`${styles.status} ${styles[transaction.status]}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {renderPagination()}
    </>
  );
};

export default TransactionList;
