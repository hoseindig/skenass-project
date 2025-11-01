interface Props {
  onSearch: (value: string) => void;
  onCategoryChange: (value: string) => void;
  categories: string[];
}

export default function SearchFilter({
  onSearch,
  onCategoryChange,
  categories,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <input
        type="text"
        placeholder="جستجوی محصول..."
        onChange={(e) => onSearch(e.target.value)}
        className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <select
        onChange={(e) => onCategoryChange(e.target.value)}
        className="p-3 border rounded-lg"
      >
        <option value="all">همه دسته‌ها</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
