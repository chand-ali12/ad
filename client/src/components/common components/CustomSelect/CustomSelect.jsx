import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import PropTypes from 'prop-types';

/**
 * Custom dropdown styled to match the site (white list, primary accents).
 * Use with react-hook-form Controller for form integration.
 * Pass searchable={true} to show a search input inside the dropdown.
 * Forwards ref to the trigger button so shouldFocusError can focus invalid fields.
 */
const CustomSelect = forwardRef(({
    options,
    value,
    onChange,
    onBlur,
    name,
    placeholder,
    className = '',
    disabled = false,
    leftIcon = null,
    triggerClassName = '',
    searchable = false,
    searchPlaceholder = 'Search...',
    emptyMessage = 'No matches',
}, ref) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!open) setSearchQuery('');
        else if (searchable && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [open, searchable]);

    const selected = options.find((o) => o.value === value || String(o.value) === String(value));
    const display = selected ? selected.label : placeholder;

    const filteredOptions = searchable && searchQuery.trim()
        ? options.filter((opt) =>
            String(opt.label ?? '').toLowerCase().includes(searchQuery.trim().toLowerCase())
          )
        : options;

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <button
                type="button"
                ref={ref}
                name={name}
                onBlur={onBlur}
                onClick={() => !disabled && setOpen((o) => !o)}
                disabled={disabled}
                className={`w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-left text-primary bg-white shadow-sm relative disabled:opacity-60 disabled:cursor-not-allowed ${leftIcon ? 'pl-10' : ''} ${triggerClassName}`}
            >
                {leftIcon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary/60">
                        {leftIcon}
                    </span>
                )}
                <span className={value !== '' && value !== undefined ? 'text-primary' : 'text-gray-400'}>{display}</span>
                <FiChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute z-[100] left-0 right-0 mt-1 py-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col">
                    {searchable && (
                        <div className="shrink-0 px-2 pb-2 pt-1 border-b border-gray-100">
                            <div className="relative">
                                <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    placeholder={searchPlaceholder}
                                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary"
                                />
                            </div>
                        </div>
                    )}
                    <ul className="overflow-y-auto overflow-x-hidden py-1 min-h-0 max-h-[min(15rem,70vh)] overscroll-contain">
                        {filteredOptions.length === 0 ? (
                            <li className="px-4 py-3 text-sm text-gray-500">{emptyMessage}</li>
                        ) : (
                            filteredOptions.map((opt) => (
                                <li key={String(opt.value)}>
                                    {opt.disabled ? (
                                        <div className="flex items-center justify-between w-full px-4 py-2.5 text-sm cursor-not-allowed select-none">
                                            <span className="text-gray-500">{opt.label}</span>
                                            {opt.rightLabel && (
                                                <span className="ml-3 text-xs shrink-0 text-gray-500">{opt.rightLabel}</span>
                                            )}
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onChange(opt.value);
                                                setOpen(false);
                                            }}
                                            className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${opt.value === value || String(opt.value) === String(value) ? 'bg-primary/10 text-primary font-medium' : 'text-primary hover:bg-gray-100'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    )}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
});

CustomSelect.displayName = 'CustomSelect';

CustomSelect.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string,
        disabled: PropTypes.bool,
        rightLabel: PropTypes.string,
    })).isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    leftIcon: PropTypes.node,
    triggerClassName: PropTypes.string,
    searchable: PropTypes.bool,
    searchPlaceholder: PropTypes.string,
    emptyMessage: PropTypes.string,
};

export default CustomSelect;
