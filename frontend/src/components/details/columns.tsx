import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { ColumnDef } from "@tanstack/react-table";
import { Song } from "../../types";
import { formatTime } from "@/utils/format-time";

const columns: ColumnDef<Song>[] = [
  {
    id: "index",
    header: () => (
      <div className="inline-flex items-center justify-center text-center">
        #
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">{row.index + 1}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    enableSorting: true,
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
              to={"/song/" + cell.getContext().row.original.id}
            >
              {cell.getContext().row.original.title}
            </Link>
          </div>
          <div>
            <Link
              className="text-muted-foreground text-xs hover:underline"
              to={"/artist/" + cell.getContext().row.original.artist?.id}
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
    enableSorting: true,
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
    header: "Release Date",
    enableSorting: true,
    cell: ({ row }) => <div>{row.getValue("release_date")}</div>,
  },
  {
    accessorKey: "duration",
    header: () => <Icon size="sm">schedule</Icon>,
    enableSorting: true,
    cell: ({ row }) => {
      const duration = row.getValue("duration") as string;
      return <div>{formatTime(parseInt(duration))}</div>;
    },
  },
];

export default columns;
