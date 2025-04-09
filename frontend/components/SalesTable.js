import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useSortBy, usePagination, useFilters } from 'react-table';
import styled from 'styled-components';
import axios from 'axios';
import SalesRepDetail from './SalesRepDetail';

// Styled components for the table
const TableContainer = styled.div`
  padding: 1rem;
  overflow-x: auto;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Table = styled.table`
  border-spacing: 0;
  border: 1px solid #ddd;
  width: 100%;
  
  tr {
    :last-child {
      td {
        border-bottom: 0;
      }
    }
  }
  
  th, td {
    margin: 0;
    padding: 0.5rem;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
    
    :last-child {
      border-right: 0;
    }
  }
  
  th {
    background-color: #f2f2f2;
    font-weight: bold;
    text-align: left;
  }
  
  tr.selected {
    background-color: #e3f2fd;
  }
  
  tbody tr:hover {
    background-color: #f5f5f5;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
`;

const PageInfo = styled.span`
  margin-right: 1rem;
`;

const PageSizeSelector = styled.div`
  margin-left: 1rem;
`;

const FilterContainer = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: ${props => props.isOpen ? 'block' : 'none'};
  animation: slideDown 0.3s ease-out;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FilterField = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  
  &::placeholder {
    color: #aaa;
  }
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#4CAF50' : '#f0f0f0'};
  color: ${props => props.primary ? 'white' : '#333'};
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 0.25rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background-color: ${props => props.primary ? '#45a049' : '#e0e0e0'};
  }
`;

const FilterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

// Default column filter component
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;
  
  return (
    <FilterInput
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

function SalesTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [totalData, setTotalData] = useState(0);
  const [selectedSalesRep, setSelectedSalesRep] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Server-side state
  const [serverPage, setServerPage] = useState(1);
  const [serverPageSize, setServerPageSize] = useState(10);
  const [serverSortBy, setServerSortBy] = useState('id');
  const [serverSortOrder, setServerSortOrder] = useState('asc');
  const [filters, setFilters] = useState({
    id: '',
    name: '',
    role: '',
    region: ''
  });
  
  // Fetch data from API
  const fetchData = async (applyFilters = false) => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', serverPage);
      params.append('page_size', serverPageSize);
      params.append('sort_by', serverSortBy);
      params.append('sort_order', serverSortOrder);
      
      // Add filters if they exist
      if (applyFilters) {
        if (filters.id) params.append('id', filters.id);
        if (filters.name) params.append('name', filters.name);
        if (filters.role) params.append('role', filters.role);
        if (filters.region) params.append('region', filters.region);
      }
      
      const response = await axios.get(`http://localhost:8000/api/sales-reps?${params.toString()}`);
      
      const newData = response.data.sales_reps;
      setData(newData);
      setPageCount(response.data.total_page);
      setTotalData(response.data.total_data);
      
      // No longer auto-selecting the first row
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);
  
  // Fetch when pagination, sorting, or filters change
  useEffect(() => {
    fetchData();
  }, [serverPage, serverPageSize, serverSortBy, serverSortOrder]);
  
  // Define columns
  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Role',
        accessor: 'role',
      },
      {
        Header: 'Region',
        accessor: 'region',
      },
      {
        Header: 'Skills',
        accessor: 'skills',
        disableSortBy: true,
        Cell: ({ value }) => (
          <div>
            {value && `${value.length} skills`}
          </div>
        )
      },
      {
        Header: 'Deals',
        accessor: 'deals',
        disableSortBy: true,
        Cell: ({ value }) => (
          <div>
            {value && `${value.length} deals`}
          </div>
        )
      },
      {
        Header: 'Clients',
        accessor: 'clients',
        disableSortBy: true,
        Cell: ({ value }) => (
          <div>
            {value && `${value.length} clients`}
          </div>
        )
      }
    ],
    []
  );
  
  // Handle row click
  const handleRowClick = (salesRep) => {
    setSelectedSalesRep(salesRep);
  };
  
  // Handle sort
  const handleSort = (column) => {
    if (serverSortBy === column) {
      // Toggle sort order if clicking the same column
      setServerSortOrder(serverSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort column and default to ascending
      setServerSortBy(column);
      setServerSortOrder('asc');
    }
    // Reset to first page when sorting changes
    setServerPage(1);
  };
  
  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Apply filters
  const handleApplyFilters = () => {
    setServerPage(1); // Reset to first page when applying filters
    fetchData(true);
    setIsFilterOpen(false); // Close filter panel after applying
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      id: '',
      name: '',
      role: '',
      region: ''
    });
  };
  
  // Toggle filter visibility
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  return (
    <TableContainer>
      <TableHeader>
        <h2>Sales Representatives</h2>
        <Button onClick={toggleFilter}>
          {isFilterOpen ? 'Hide Filters' : 'Show Filters'} 
          {isFilterOpen ? '▲' : '▼'}
        </Button>
      </TableHeader>
      
      <FilterContainer isOpen={isFilterOpen}>
        <FilterRow>
          <FilterField>
            <FilterInput
              value={filters.id}
              onChange={e => handleFilterChange('id', e.target.value)}
              placeholder="ID"
            />
          </FilterField>
          <FilterField>
            <FilterInput
              value={filters.name}
              onChange={e => handleFilterChange('name', e.target.value)}
              placeholder="Name"
            />
          </FilterField>
          <FilterField>
            <FilterInput
              value={filters.role}
              onChange={e => handleFilterChange('role', e.target.value)}
              placeholder="Role"
            />
          </FilterField>
          <FilterField>
            <FilterInput
              value={filters.region}
              onChange={e => handleFilterChange('region', e.target.value)}
              placeholder="Region"
            />
          </FilterField>
        </FilterRow>
        <FilterActions>
          <Button onClick={handleResetFilters}>Reset</Button>
          <Button primary onClick={handleApplyFilters}>Apply Filters</Button>
        </FilterActions>
      </FilterContainer>
      
      {selectedSalesRep && (
        <SalesRepDetail 
          salesRep={selectedSalesRep} 
          onClose={() => setSelectedSalesRep(null)} 
        />
      )}
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                {columns.map(column => (
                  <th 
                    key={column.accessor}
                    onClick={() => !column.disableSortBy && handleSort(column.accessor)}
                    style={{ cursor: column.disableSortBy ? 'default' : 'pointer' }}
                  >
                    {column.Header}
                    {!column.disableSortBy && (
                      <span>
                        {serverSortBy === column.accessor ? (
                          serverSortOrder === 'asc' ? ' 🔼' : ' 🔽'
                        ) : ''}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr 
                  key={i} 
                  onClick={() => handleRowClick(row)}
                  className={selectedSalesRep && selectedSalesRep.id === row.id ? 'selected' : ''}
                  style={{ cursor: 'pointer' }}
                >
                  {columns.map(column => (
                    <td key={column.accessor}>
                      {column.Cell ? column.Cell({ value: row[column.accessor] }) : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
          
          <Pagination>
            <div>
              <Button
                onClick={() => setServerPage(old => Math.max(old - 1, 1))}
                disabled={serverPage === 1}
              >
                Previous
              </Button>
              <Button
                onClick={() => setServerPage(old => (old < pageCount ? old + 1 : old))}
                disabled={serverPage >= pageCount}
              >
                Next
              </Button>
            </div>
            
            <PageInfo>
              Page{' '}
              <strong>
                {serverPage} of {pageCount}
              </strong>
            </PageInfo>
            
            <PageSizeSelector>
              <select
                value={serverPageSize}
                onChange={e => {
                  setServerPageSize(Number(e.target.value));
                  setServerPage(1); // Reset to first page when changing page size
                }}
              >
                {[1, 5, 10].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </PageSizeSelector>
            
            <div>
              Showing {data.length} of {totalData} results
            </div>
          </Pagination>
        </>
      )}
    </TableContainer>
  );
}

export default SalesTable; 