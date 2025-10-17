import './Pagination.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showInfo = true 
}) => {
  
  if (totalPages <= 1) return null;

  // Seitenzahlen Array generieren
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Maximal 5 Seiten-Buttons anzeigen

    if (totalPages <= maxVisible) {
      // Alle Seiten anzeigen wenn <= 5
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart Pagination: [1] ... [4][5][6] ... [10]
      if (currentPage <= 3) {
        // Am Anfang: [1][2][3][4] ... [10]
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Am Ende: [1] ... [7][8][9][10]
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In der Mitte: [1] ... [4][5][6] ... [10]
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (page) => {
    if (page !== '...' && page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="pagination">
      {showInfo && (
        <div className="pagination__info">
          Seite {currentPage} von {totalPages}
        </div>
      )}

      <div className="pagination__controls">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="pagination__btn pagination__btn--prev"
          aria-label="Vorherige Seite"
        >
          ← Zurück
        </button>

        <div className="pagination__numbers">
          {pageNumbers.map((page, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(page)}
              disabled={page === '...' || page === currentPage}
              className={`pagination__btn ${
                page === currentPage ? 'pagination__btn--active' : ''
              } ${page === '...' ? 'pagination__btn--dots' : ''}`}
              aria-label={`Seite ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="pagination__btn pagination__btn--next"
          aria-label="Nächste Seite"
        >
          Weiter →
        </button>
      </div>
    </div>
  );
};

export default Pagination;