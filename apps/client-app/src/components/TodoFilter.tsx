import React, { useState, useEffect } from 'react';

export interface FilterBy {
  completed?: string;
  sortBy?: string;
};

interface FilterProps {
  fetchTodos: (query?: string) => void;
  isTodoFiltered: React.MutableRefObject<boolean>;
}

const TodoFilter: React.FC<FilterProps> = ({ fetchTodos, isTodoFiltered }) => {
  const defaultFilteringValues = {
    completed: 'all',
    sortBy: 'none'
  };
  const [filterCriteria, setFilterCriteria] = useState<FilterBy>(defaultFilteringValues);

  /**
   * Listens to the requests from parent (TodoList) component to reset the filter to default values
   */
  useEffect(() => {
    if (isTodoFiltered.current === false) {
      setFilterCriteria(defaultFilteringValues);
    }
  }, [isTodoFiltered.current]);

  const handleFilterChange = (filters: FilterBy) => {
    const searchParams = new URLSearchParams();
    const { completed, sortBy } = filters || {};

    if (completed && completed !== defaultFilteringValues.completed) {
      searchParams.append('completed', completed)
    }

    if (sortBy && sortBy !== defaultFilteringValues.sortBy) {
      searchParams.append('sortBy', sortBy)
    }

    setFilterCriteria({
      sortBy: sortBy,
      completed: completed,
    });

    // Informs that the filter is currently applied
    isTodoFiltered.current = searchParams.size ? true : false;

    fetchTodos(searchParams.size ? `?${searchParams.toString()}` : undefined);
  }

  return (
    <div className="flex gap-2 items-center flex-wrap mb-4 sm:mb-0">
      <label className="mr-2">Sort by:</label>
      <select
        className="border rounded px-2 py-1"
        value={filterCriteria.sortBy || 'none'}
        onChange={(e) => handleFilterChange({ ...filterCriteria, sortBy: e.target.value })}
      >
        <option value="none">Due Date</option>
        <option value="dueDate:asc">Due Date (Asc)</option>
        <option value="dueDate:desc">Due Date (Desc)</option>
      </select>
      <select
        className="border rounded px-2 py-1"
        value={filterCriteria.completed || 'all'}
        onChange={(e) => handleFilterChange({ ...filterCriteria, completed: e.target.value })}
      >
        <option value="all">All</option>
        <option value="true">Completed</option>
        <option value="false">Incomplete</option>
      </select>
    </div>
  );
};

export default TodoFilter;
