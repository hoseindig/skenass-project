"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { useState } from "react";

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export default function SearchFilter({
  onSearch,
  onCategoryChange,
  categories,
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fade-in">
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="جستجو محصولات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" size="md">
            جستجو
          </Button>
        </div>
      </form>

      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">دسته‌بندی:</span>

        <Button
          variant={selectedCategory === "all" ? "primary" : "outline"}
          size="sm"
          onClick={() => handleCategoryChange("all")}
        >
          همه
        </Button>

        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "primary" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}
