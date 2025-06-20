import React from 'react';

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex items-center bg-white border-2 border-[#808080] shadow-win98-inner px-2 py-1">
      <div className="pr-2 text-[#000080] font-bold text-sm">
        🔍
      </div>
      <input
        type="text"
        placeholder="Search by name or paste address"
        className="w-full bg-transparent py-1 text-black placeholder-gray-500 text-sm focus:outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;