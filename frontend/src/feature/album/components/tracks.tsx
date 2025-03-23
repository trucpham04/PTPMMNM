"use client";

import { DataTable } from "./data-table";
import { Track } from "../types/types";

export default function AlbumTracks({ data }: { data: Track[] }) {
  return (
    <>
      <DataTable data={data}></DataTable>
    </>
  );
}
