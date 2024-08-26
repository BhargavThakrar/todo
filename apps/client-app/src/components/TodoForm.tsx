import React, { useState } from 'react';
import { isDatePastdue, getCurrentDate, getDateFromUtc } from '../util/date.util';

type Todo = {
  id: string;
  description: string;
  dueDate: string;
}

interface TodoFormProps {
  todo: Todo | null;
  onSave: (todo: Todo) => Promise<void|string>;
  onClose: () => void;
}

interface FormErrors {
  description?: string;
  dueDate?: string;
};

const MAX_CHAR_ALLOWED_FOR_DESCRIPTION = 60;

const TodoForm: React.FC<TodoFormProps> = ({ todo, onSave, onClose }) => {
  const [description, setDescription] = useState(todo?.description || '');
  const [dueDate, setDueDate] = useState(todo?.dueDate || '');
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');

  const isFormvalid = () => {
    const validations = [];

    // Validate description
    if (!description) {
      validations.push(['description', 'Description is required']);
    }
    if (description.length > MAX_CHAR_ALLOWED_FOR_DESCRIPTION) {
      validations.push(['description', `Description must be ${MAX_CHAR_ALLOWED_FOR_DESCRIPTION} characters or fewer`]);
    }

    // Validate due date
    if (dueDate) {
      if (isNaN(Date.parse(dueDate))) {
        validations.push(['dueDate', 'Due date is invalid']);
      }

      if (isDatePastdue(dueDate)) {
        validations.push(['dueDate', 'Due date should be in future']);
      }
    }

    if (validations.length) {
      setErrors({
        ...errors,
        ...Object.fromEntries(validations),
      });
      return false;
    }

    return true;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if form is valid
    if (!isFormvalid()) return;

    // All good - submit the form
    const error = await onSave({
      id: todo?.id || '',
      description,
      dueDate: dueDate,
    });

    if (error) {
      setApiError(error);
    } else {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} onFocus={() => setApiError('')} className="space-y-4">
      {apiError && <span className="text-red-500 text-sm">{apiError}</span>}
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={(e) => setDescription(e.target.value.trim())}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
          required
          maxLength={MAX_CHAR_ALLOWED_FOR_DESCRIPTION}
        />
        {errors && errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Due Date</label>
        <input
          type="date"
          min={getCurrentDate()}
          value={dueDate && getDateFromUtc(dueDate)}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
        />
        {errors && errors.dueDate && <span className="text-red-500 text-sm">{errors.dueDate}</span>}
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default TodoForm;
