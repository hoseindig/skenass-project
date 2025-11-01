interface Props {
  onSearch: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  categories: string[];
}

export default function SearchFilter({
  onSearch,
  onCategoryChange,
  onGenderChange,
  categories,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <input
        type="text"
        placeholder="جستجوی دکتر..."
        onChange={(e) => onSearch(e.target.value)}
        className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <select
        onChange={(e) => onCategoryChange(e.target.value)}
        className="p-3 border rounded-lg min-w-[150px]"
      >
        <option value="all">همه دسته‌ها</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select
        onChange={(e) => onGenderChange(e.target.value)}
        className="p-3 border rounded-lg min-w-[150px]"
      >
        <option value="all">همه جنسیت‌ها</option>
        <option value="male">آقا</option>
        <option value="female">خانم</option>
        <option value="unknown">نامشخص</option>
      </select>
    </div>
  );
}