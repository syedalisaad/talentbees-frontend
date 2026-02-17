"use client";

import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';

type OptionID = string | number;

interface Option {
  id: OptionID;
  name: string;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  selectedValues: Option[];
  onChange: (selected: Option[]) => void;
  placeholder?: string;
}

export default function FlexibleMultiSelect({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "Select..."
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option: Option) => {
    const isAlreadySelected = selectedValues.some(item => item.id === option.id);
    if (isAlreadySelected) {
      onChange(selectedValues.filter(item => item.id !== option.id));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  const removeOption = (id: OptionID) => {
    onChange(selectedValues.filter(item => item.id !== id));
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      {label && <label className="text-[10px] font-black uppercase tracking-tighter text-slate-400 ml-1 mb-1 block">{label}</label>}
      
      <div className="relative">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`min-h-[38px] w-full p-1.5 bg-white border rounded-lg flex flex-wrap gap-1 items-center cursor-pointer transition-all ${
            isOpen ? "border-yellow-400 ring-2 ring-yellow-100/50" : "border-slate-200 hover:border-slate-300 shadow-sm"
          }`}
        >
          {selectedValues.length === 0 && (
            <span className="text-slate-400 text-xs ml-2 select-none">{placeholder}</span>
          )}
          
          {selectedValues.map(item => (
            <span 
              key={item.id.toString()} 
              className="flex items-center gap-1 bg-yellow-300 text-slate-900 text-[10px] font-bold px-2 py-1 rounded-md"
            >
              {item.name}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(item.id);
                }}
                className="hover:text-white transition-colors"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </span>
          ))}
          
          <ChevronDown className={`ml-auto mr-1 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={14} />
        </div>

        {isOpen && (
          <div className="absolute left-0 right-0 z-[999] mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl py-1 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1">
            {options.map(option => {
              const active = selectedValues.some(item => item.id === option.id);
              return (
                <div
                  key={option.id.toString()}
                  onClick={() => toggleOption(option)}
                  className={`px-3 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    active ? "bg-yellow-50 text-slate-900 font-bold" : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  {option.name}
                  {active && <div className="w-1.5 h-1.5 rounded-full bg-yellow-300" />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}