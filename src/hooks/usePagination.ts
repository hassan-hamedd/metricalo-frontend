import { useState, useMemo } from "react";

export interface PaginationConfig {
  page: number;
  limit: number;
  total: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  pageNumbers: number[];
  hasPrevious: boolean;
  hasNext: boolean;
  goToPage: (page: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  updateConfig: (config: Partial<PaginationConfig>) => void;
}

/**
 * Custom hook for pagination logic
 */
export const usePagination = (
  initialConfig: Partial<PaginationConfig> = {}
): PaginationResult => {
  const [page, setPage] = useState(initialConfig.page || 1);
  const [limit, setLimit] = useState(initialConfig.limit || 10);
  const [total, setTotal] = useState(initialConfig.total || 0);

  // Update state when config changes
  const updateConfig = (config: Partial<PaginationConfig>) => {
    if (config.page !== undefined) setPage(config.page);
    if (config.limit !== undefined) setLimit(config.limit);
    if (config.total !== undefined) setTotal(config.total);
  };

  // Calculate derived values
  const paginationData = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(total / limit));

    // Generate array of page numbers to display
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);
    const pageNumbers = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    return {
      totalPages,
      pageNumbers,
      hasPrevious: page > 1,
      hasNext: page < totalPages,
    };
  }, [page, limit, total]);

  // Navigation functions
  const goToPage = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, paginationData.totalPages)));
  };

  const goToPreviousPage = () => {
    if (paginationData.hasPrevious) {
      goToPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (paginationData.hasNext) {
      goToPage(page + 1);
    }
  };

  return {
    page,
    limit,
    total,
    ...paginationData,
    goToPage,
    goToPreviousPage,
    goToNextPage,
    updateConfig,
  };
};

export default usePagination;
