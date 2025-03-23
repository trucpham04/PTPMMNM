import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { ColumnDef } from "@tanstack/react-table";
import { Track } from "../../album/types/types";

const columns: ColumnDef<Track>[] = [
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
            src={cell.getContext().row.original.cover_url}
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
              to={"/artist/" + cell.getContext().row.original.artistID}
            >
              {cell.getContext().row.original.artistName}
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
        cell.getContext().row.original.albumID === null ||
        cell.getContext().row.original.albumName === null
      ) {
        return <div>-</div>;
      }

      return (
        <div>
          <Link
            className="hover:underline"
            to={"/album/" + cell.getContext().row.original.albumID}
          >
            {cell.getContext().row.original.albumName}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "dateAdded",
    header: "Date added",
    cell: ({ row }) => <div>{row.getValue("dateAdded")}</div>,
  },
  {
    accessorKey: "duration",
    header: () => <Icon size="sm">schedule</Icon>,
    cell: ({ row }) => <div>{row.getValue("duration")}</div>,
  },
];

export default columns;
