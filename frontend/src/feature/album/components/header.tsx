export default function AlbumHeader() {
  return (
    <div className="flex max-h-80 min-h-44 w-full items-end gap-4 bg-green-500 px-[max(2%,16px)] pt-12 pb-[max(2%,16px)]">
      <img
        src="https://github.com/shadcn.png"
        alt="Album cover"
        className="aspect-square w-1/5 max-w-64 min-w-32 rounded-md"
      />
      <div>
        <div>Type</div>
        <div className="text-7xl font-extrabold">Album name</div>
        <div>Author</div>
      </div>
    </div>
  );
}
