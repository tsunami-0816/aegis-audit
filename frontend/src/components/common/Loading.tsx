export const Loading = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-b-indigo-600" style={{ animationDuration: '1.5s' }} />
      </div>
    </div>
  );
};
