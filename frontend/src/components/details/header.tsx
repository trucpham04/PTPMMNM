import { cn } from "@/lib/utils";
import { Link, useParams } from "react-router-dom";

export interface AlbumHeaderPropsInterface {
  cover_url?: string;
  backdrop_url?: string;
  type?: string;
  title?: string;
  author_name?: string;
  author_type?: string;
  author_id?: number;
  subtitle?: string;
}

export default function AlbumHeader({
  cover_url,
  backdrop_url,
  type,
  title,
  author_name,
  author_type,
  author_id,
}: AlbumHeaderPropsInterface) {
  const { album_id } = useParams();
  return (
    <div
      className={cn(
        "flex aspect-[4] max-h-80 w-full items-end gap-4 px-[max(2%,16px)] pt-12 pb-[max(2%,16px)]",
        { "bg-green-500": !backdrop_url },
      )}
    >
      {cover_url != null ? (
        <img
          src={cover_url}
          alt={title}
          className="aspect-square w-1/5 max-w-64 min-w-32 rounded-md"
        />
      ) : (
        <div className=""></div>
      )}
      <div className="space-y-2">
        <div>{type}</div>
        <div className="text-7xl font-extrabold">{title}</div>
        <div className="text-lg">
          {author_type === "artist" ? (
            <Link to={`/artist/${author_id}`} className="hover:underline">
              {author_name}
            </Link>
          ) : (
            <>{author_name}</>
          )}
        </div>
      </div>
    </div>
  );
}
