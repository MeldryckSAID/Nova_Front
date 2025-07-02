'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface Option {
  id: number;
  name: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: number[];
  onChange: (selected: number[]) => void;
  placeholder?: string;
  minSelection?: number;
  maxSelection?: number;
  label?: string;
  error?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Sélectionnez vos options...',
  minSelection = 1,
  maxSelection = 5,
  label,
  error,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOption = (optionId: number) => {
    if (selected.includes(optionId)) {
      onChange(selected.filter((item) => item !== optionId));
    } else {
      if (selected.length < maxSelection) {
        onChange([...selected, optionId]);
      }
    }
  };

  const removeOption = (optionId: number) => {
    onChange(selected.filter((item) => item !== optionId));
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-primary-text dark:text-dark-base-text">
          {label}
          <span className="text-primary-text/70 dark:text-dark-base-text/70 ml-1">
            ({minSelection}-{maxSelection} sélections)
          </span>
        </label>
      )}

      {/* Champ de sélection */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-royal-blue/20 focus:border-royal-blue bg-white dark:bg-blue-gray-dark text-left flex items-center justify-between text-primary-text dark:text-dark-base-text transition-colors ${
            error
              ? 'border-soft-error-red'
              : 'border-light-blue-gray/20 dark:border-royal-blue/30'
          }`}
        >
          <span
            className={
              selected.length === 0
                ? 'text-primary-text/70 dark:text-dark-base-text/70'
                : 'text-primary-text dark:text-dark-base-text'
            }
          >
            {selected.length === 0
              ? placeholder
              : `${selected.length} sélection(s)`}
          </span>
          <svg
            className={`w-5 h-5 transition-transform text-primary-text dark:text-dark-base-text ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-blue-gray-dark border border-light-blue-gray/20 dark:border-royal-blue/30 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map((option) => {
              const isSelected = selected.includes(option.id);
              const isDisabled = !isSelected && selected.length >= maxSelection;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => !isDisabled && handleToggleOption(option.id)}
                  disabled={isDisabled}
                  className={`w-full px-3 py-2 text-left hover:bg-royal-blue/10 dark:hover:bg-royal-blue/20 focus:bg-royal-blue/10 dark:focus:bg-royal-blue/20 flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-royal-blue/10 text-royal-blue'
                      : 'text-primary-text dark:text-dark-base-text'
                  } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span>{option.name}</span>
                  {isSelected && <span className="text-royal-blue">✓</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bulles des sélections */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-light-blue-gray/10 dark:bg-royal-blue/10 rounded-md max-w-full">
          {selected.map((id) => {
            const option = options.find((opt) => opt.id === id);
            return (
              <span
                key={id}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-royal-blue text-white border border-royal-blue/20 max-w-full"
              >
                <span className="truncate">{option?.name ?? id}</span>
                <button
                  type="button"
                  onClick={() => removeOption(id)}
                  className="ml-2 hover:text-white/80 focus:outline-none"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Message d'erreur */}
      {error && <p className="text-sm text-soft-error-red">{error}</p>}

      {/* Indication du nombre de sélections */}
      <p className="text-xs text-primary-text/70 dark:text-dark-base-text/70">
        {selected.length}/{maxSelection} sélections
        {selected.length < minSelection && (
          <span className="text-soft-error-red ml-1">
            (minimum {minSelection} requis)
          </span>
        )}
      </p>
    </div>
  );
}
