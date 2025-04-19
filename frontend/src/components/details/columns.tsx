import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { ColumnDef } from "@tanstack/react-table";
import { Song } from "../../types";

const columns: ColumnDef<Song>[] = [
  {
    id: "index",
    header: () => <div className="text-right">#</div>,
    cell: ({ row }) => <div className="text-right">{row.index + 1}</div>,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ cell }) => (
      <div className="flex items-center gap-2">
        <div className="size-10">
          <img
            className="rounded-sm"
            src={cell.getContext().row.original.album?.cover_image}
            alt=""
          />
        </div>
        <div>
          <div>
            <Link
              className="hover:underline"
              to={"/track/" + cell.getContext().row.original.id}
            >
              {cell.getContext().row.original.title}
            </Link>
          </div>
          <div>
            <Link
              className="text-muted-foreground text-xs hover:underline"
              to={"/artist/" + cell.getContext().row.original.artist_id}
            >
              {cell.getContext().row.original.artist?.name}
            </Link>
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "albumName",
    header: "Album",
    cell: ({ cell }) => {
      if (
        cell.getContext().row.original.album_id === null ||
        cell.getContext().row.original.album?.title === null
      ) {
        return <div>-</div>;
      }

      return (
        <div>
          <Link
            className="hover:underline"
            to={"/album/" + cell.getContext().row.original.album?.id}
          >
            {cell.getContext().row.original.album?.title}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "release_date",
    header: "Date added",
    cell: ({ row }) => <div>{row.getValue("release_date")}</div>,
  },
  {
    accessorKey: "duration",
    header: () => <Icon size="sm">schedule</Icon>,
    cell: ({ row }) => {
      const duration = row.getValue("duration");
      return <div>{duration ? duration : "-"}</div>;
    },
  },
];

export default columns;
