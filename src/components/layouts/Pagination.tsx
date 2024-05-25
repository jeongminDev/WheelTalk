interface PaginationProps {
  currentPage: number;
  setCurrentPage: (pageNumber: number) => void;
  totalItems: number; // 총 아이템 수
  itemsPerPage: number; // 페이지당 아이템 수
}

const Pagination = ({ currentPage, setCurrentPage, totalItems, itemsPerPage }: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage); // 총 페이지 수 계산

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  console.log(totalPages);

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
