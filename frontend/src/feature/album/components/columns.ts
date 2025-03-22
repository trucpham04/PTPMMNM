import { ColumnDef } from "@tanstack/react-table";
import { Track } from "../types/track";

export const columns: ColumnDef<Track>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "albumName",
    header: "Album",
  },
  {
    accessorKey: "dateAdded",
    header: "Date added",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
];
