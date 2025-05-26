import React from 'react';
import styles from './Table.module.scss';
import Button from '../Button/Button';
import { FiDownload } from 'react-icons/fi';

export interface TableColumn<T> {
  key: string;
  header: React.ReactNode;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  striped?: boolean;
  bordered?: boolean;
  compact?: boolean;
  className?: string;
  emptyText?: React.ReactNode;
  rowKey?: string | ((record: T, index: number) => string);
  pagination?: {
    pageSize: number;
    total: number;
    current: number;
    onChange: (page: number) => void;
  };
}

export const Table = <T extends Record<string, unknown>>({
  columns,
  data,
  striped = true,
  bordered = false,
  compact = false,
  className = '',
  emptyText = 'No data',
  rowKey,
  pagination,
}: TableProps<T>) => {
  const tableClasses = [
    styles.table,
    striped ? styles.striped : '',
    bordered ? styles.bordered : '',
    compact ? styles.compact : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record, index);
    }
    return rowKey ? String(record[rowKey]) : index.toString();
  };

  // Calculate pagination information
  const currentPage = pagination?.current || 1;
  const pageSize = pagination?.pageSize || 10;
  const total = pagination?.total || 0;
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, total);
  const totalPages = Math.ceil(total / pageSize);

  const renderEmptyState = () => (
    <tr>
      <td colSpan={columns.length} className={styles.emptyState}>
        <FiDownload size={32} />
        <h4>No Data Found</h4>
        <p>{emptyText}</p>
      </td>
    </tr>
  );

  const getCellAlignClass = (align?: string) => {
    if (align === 'center') return styles.cellAlignCenter;
    if (align === 'right') return styles.cellAlignRight;
    return '';
  };

  return (
    <div className={styles.tableContainer}>
      <table className={tableClasses}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{ width: column.width ? column.width : undefined }}
                className={getCellAlignClass(column.align)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((record, index) => (
              <tr key={getRowKey(record, index)}>
                {columns.map((column) => (
                  <td key={column.key} className={getCellAlignClass(column.align)}>
                    {column.render
                      ? column.render(record[column.key], record, index)
                      : String(record[column.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            renderEmptyState()
          )}
        </tbody>
      </table>
      
      {pagination && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            {data.length > 0 
              ? `Showing ${startIndex} to ${endIndex} of ${total} entries` 
              : `0 entries`}
          </div>
          <div className={styles.paginationControls}>
            <Button
              size="small"
              variant="secondary"
              onClick={() => pagination.onChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <Button
              size="small"
              variant="secondary"
              onClick={() => pagination.onChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table; 