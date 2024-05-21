interface PaginationProps {
  currentPage: number;
  setCurrentPage: (pageNumber: number) => void;
}

const Pagination = ({ currentPage, setCurrentPage }: PaginationProps) => {
  const totalPages = 3; // 총 페이지 수, 실제로는 서버로부터 받거나 계산해야 함

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="join" style={{ justifyContent: 'center' }}>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          className={`join-item btn ${currentPage === index + 1 ? 'btn-active' : ''}`}
          onClick={() => handlePageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
