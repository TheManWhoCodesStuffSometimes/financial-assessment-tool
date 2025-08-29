export default function ViewToggle({ viewMode, setViewMode }) {
  const views = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'quarter', label: 'Quarter' }
  ];

  return (
    <div className="flex rounded-md shadow-sm" role="group">
      {views.map((view, index) => (
        <button
          key={view.key}
          onClick={() => setViewMode(view.key)}
          className={`
            px-4 py-2 text-sm font-medium border
            ${index === 0 ? 'rounded-l-md' : ''}
            ${index === views.length - 1 ? 'rounded-r-md' : ''}
            ${index !== 0 ? 'border-l-0' : ''}
            ${viewMode === view.key 
              ? 'bg-blue-600 text-white border-blue-600 z-10' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }
            focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          `}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}
