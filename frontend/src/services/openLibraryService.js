const OPEN_LIBRARY_BASE = 'https://openlibrary.org';
const COVERS_BASE = 'https://covers.openlibrary.org/b';

const MAX_TOTAL_RESULTS = 100;  
const RESULTS_PER_PAGE = 10;

const openLibraryService = {
  
  searchByISBN: async (isbn) => {
    try {
      const cleanISBN = isbn.replace(/[^0-9X]/gi, '');
      
      const response = await fetch(
        `${OPEN_LIBRARY_BASE}/isbn/${cleanISBN}.json`
      );
      
      if (!response.ok) {
        throw new Error('Buch mit dieser ISBN nicht gefunden');
      }
      
      const data = await response.json();
      return openLibraryService.formatBookData(data);
    } catch (error) {
      throw error;
    }
  },

  searchByQuery: async (query, page = 1, limit = RESULTS_PER_PAGE) => {
    try {
      const offset = (page - 1) * limit;
      
      // Verhindere Zugriff über Maximum hinaus
      if (offset >= MAX_TOTAL_RESULTS) {
        return {
          results: [],
          totalResults: MAX_TOTAL_RESULTS,
          currentPage: page,
          totalPages: Math.ceil(MAX_TOTAL_RESULTS / limit)
        };
      }
      
      const response = await fetch(
        `${OPEN_LIBRARY_BASE}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
      );
      
      if (!response.ok) {
        throw new Error('Suche fehlgeschlagen');
      }
      
      const data = await response.json();
      
      if (!data.docs || data.docs.length === 0) {
        return {
          results: [],
          totalResults: 0,
          currentPage: page,
          totalPages: 0
        };
      }

      const actualTotalResults = data.numFound || 0;
      const limitedTotalResults = Math.min(actualTotalResults, MAX_TOTAL_RESULTS);
      const totalPages = Math.ceil(limitedTotalResults / limit);
      
      // Formatiere Ergebnisse
      const results = data.docs.map(book => ({
        title: book.title || 'Unbekannt',
        author: book.author_name || ['Unbekannt'],
        isbn: book.isbn?.[0] || null,
        publishedYear: book.first_publish_year || null,
        imageUrl: book.cover_i 
          ? `${COVERS_BASE}/id/${book.cover_i}-L.jpg`
          : null,
        openLibraryKey: book.key || null,
        numberOfPages: book.number_of_pages_median || null,
        publisher: book.publisher?.[0] || null,
      }));

      return {
        results,
        totalResults: limitedTotalResults,  
        currentPage: page,
        totalPages,
        resultsPerPage: limit
      };
    } catch (error) {
      throw error;
    }
  },

  getBookDetails: async (olKey) => {
    try {
      const response = await fetch(`${OPEN_LIBRARY_BASE}${olKey}.json`);
      
      if (!response.ok) {
        throw new Error('Buch-Details nicht gefunden');
      }
      
      const data = await response.json();
      return openLibraryService.formatBookData(data);
    } catch (error) {
      throw error;
    }
  },

  formatBookData: (data) => {
    let imageUrl = null;
    if (data.covers && data.covers[0]) {
      imageUrl = `${COVERS_BASE}/id/${data.covers[0]}-L.jpg`;
    }

    let description = '';
    if (data.description) {
      description = typeof data.description === 'string' 
        ? data.description 
        : data.description.value || '';
    }

    let authors = ['Unbekannt'];
    if (data.authors && data.authors.length > 0) {
      authors = data.authors.map(a => a.name || 'Unbekannt');
    } else if (data.by_statement) {
      authors = [data.by_statement];
    }

    return {
      title: data.title || 'Unbekannt',
      author: authors,
      description: description.substring(0, 1000),
      imageUrl: imageUrl,
      isbn: data.isbn_13?.[0] || data.isbn_10?.[0] || null,
      publishedYear: data.publish_date || null,
      numberOfPages: data.number_of_pages || null,
      publisher: data.publishers?.[0] || null,
    };
  },

  getImageUrl: (coverId, size = 'L') => {
    if (!coverId) return null;
    return `${COVERS_BASE}/id/${coverId}-${size}.jpg`;
  },

};

export default openLibraryService;
