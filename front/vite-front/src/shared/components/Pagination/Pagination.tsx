import './Pagination.css';

interface PaginationProps {
    currentPage: number;
    onPageChange: (page: number) => void;
    hasNextPage: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, onPageChange, hasNextPage }) => {
    return (
        <div className="pagination">
            <button className="pagination-btn" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                <i className="bi bi-chevron-left"></i> Anterior
            </button>

            <div className="pagination-info">
                <span className="page-number">{currentPage}</span>
            </div>

            <button className="pagination-btn" onClick={() => onPageChange(currentPage + 1)} disabled={!hasNextPage}>
                Siguiente <i className="bi bi-chevron-right"></i>
            </button>
        </div>
    );
};

export default Pagination;
