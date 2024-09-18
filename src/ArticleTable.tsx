import React, { useState, useEffect } from 'react';
import { fetchArticles } from './api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faGrip, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface Article {
  author: string;
  title: string;
  publishedAt: string;
  urlToImage: string;
  description: string;
}

const ArticleTable: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sortField, setSortField] = useState<'author' | 'title' | 'publishedAt'>('publishedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');

  useEffect(() => {
    const loadArticles = async () => {
      const data = await fetchArticles(searchTerm, currentPage, pageSize);
      if (data && data.status === 'ok') {
        setArticles(data.articles);
        setTotalResults(data.totalResults);
      } else {
        console.error('Error fetching articles:', data);
      }
    };

    loadArticles();
  }, [searchTerm, currentPage, pageSize]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field: 'author' | 'title' | 'publishedAt') => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortField(field);
    setSortDirection(isAsc ? 'desc' : 'asc');
    sortArticles(articles, field, isAsc ? 'desc' : 'asc');
  };

  const sortArticles = (articlesToSort: Article[], field: keyof Article, direction: 'asc' | 'desc') => {
    const sortedArticles = [...articlesToSort].sort((a, b) => {
      if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setArticles(sortedArticles);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'card' : 'list');
  };

  return (
    <div className='container'>
      <h1>News Articles</h1>

      <div className='filters'>

        {/* Search Input */}
        <div className='search'>
          <input
            type="text"
            placeholder="Search article..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* View Toggle Button */}
        <div className='view'>
          <button onClick={toggleViewMode}>
            {viewMode === 'list' ? (
              <FontAwesomeIcon icon={faGrip} /> // Grid icon when in list view
            ) : (
              <FontAwesomeIcon icon={faList} />  // List icon when in card view
            )}
          </button>
        </div>

      </div>

      {/* Render articles in List or Card View */}
      {viewMode === 'list' ? (
        <table cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th onClick={() => handleSort('title')}>
                Title {sortField === 'title' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => handleSort('author')}>
                Author {sortField === 'author' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => handleSort('publishedAt')}>
                Date {sortField === 'publishedAt' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {articles
              .filter(article => article.title !== '[Removed]')
              .map((article, index) => (
                <tr key={index}>
                  <td className='article-title'>{article.title}</td>
                  <td className='article-author'><span className='author'>{article.author || 'Unknown'}</span></td>
                  <td className='date'>{new Date(article.publishedAt).toLocaleDateString()}</td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <div className="card-view">
          {articles
            .filter(article => article.title !== '[Removed]')
            .map((article, index) => (
              <div key={index} className="card">
                  <figure>
                {article.urlToImage && (
                    <img src={article.urlToImage} alt={article.title} className="card-image" />
                )}
                    <figcaption className='hidden'>{article.title}</figcaption>
                  </figure>
                <div className="card-content">
                  <h3>{article.title}</h3>
                  <p><span className='author'>{article.author || 'Unknown'}</span></p>
                  <p className='date'>{new Date(article.publishedAt).toLocaleDateString()}</p>
                  <p>{article.description || 'No description available'}</p>
                </div>
              </div>
            ))}
        </div>
      )}

      <div className='page-controls'>

        {/* Page Size Dropdown */}
        <div className='page-size'>
          <label htmlFor="pageSize">Per Page: </label>
          <select id="pageSize" value={pageSize} onChange={handlePageSizeChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Pagination Controls */}
        <div className='pagination'>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <span>Page {currentPage}</span>

          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage * pageSize >= totalResults}>
          <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ArticleTable;