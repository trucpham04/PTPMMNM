"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Song } from "../../types";
import columns from "./columns";
import { usePlayer } from "@/contexts/playerContext";
import Icon from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { useFavorite } from "@/hooks/useFavorite";
import { useAuth } from "@/contexts/authContext";
import { formatTime } from "@/utils/format-time";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DataTable({ data }: { data: Song[] }) {
  const { play, currentSong, isPlaying, togglePlay, addSongToQueue } =
    usePlayer();
  const { user } = useAuth();
  const [sorting, setSorting] = useState<SortingState>([]);
  const {
    isFavorited,
    getIsSongFavorited,
    addSongToFavorites,
    removeSongFromFavorites,
  } = useFavorite();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const handleFavoriteClick = async (songId: number) => {
    if (!user) return;

    const isFavorited = await getIsSongFavorited(user.id, songId);
    if (isFavorited) {
      await removeSongFromFavorites(user.id, songId);
      toast.success("Removed from Favorites", {
        description: "Song has been removed from your favorites",
      });
    } else {
      await addSongToFavorites(user.id, songId);
      toast.success("Added to Favorites", {
        description: "Song has been added to your favorites",
      });
    }
  };

  const handleAddToQueue = (song: Song) => {
    addSongToQueue(song);
    toast.success("Added to Queue", {
      description: `${song.title} has been added to your queue`,
    });
  };

  return (
    <div className="rounded-md">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      header.column.getCanSort() &&
                        "cursor-pointer select-none",
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {{
                        asc: <Icon size="sm">arrow_upward</Icon>,
                        desc: <Icon size="sm">arrow_downward</Icon>,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const song = row.original;
              const isCurrentSong = currentSong?.id === song.id;

              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group relative"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.id === "index" ? (
                        <div className="flex items-center justify-end">
                          <span className="transition-opacity group-hover:opacity-0">
                            {row.index + 1}
                          </span>
                          <button
                            className="cursor-pointer opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isCurrentSong) {
                                togglePlay();
                              } else {
                                play(song);
                              }
                            }}
                          >
                            <Icon size="lg">
                              {isCurrentSong && isPlaying
                                ? "pause"
                                : "play_arrow"}
                            </Icon>
                          </button>
                        </div>
                      ) : cell.column.id === "duration" ? (
                        <div className="flex items-center justify-between gap-2">
                          <span>{formatTime(parseInt(song.duration))}</span>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="cursor-pointer opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Icon size="md">more_vert</Icon>
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToQueue(song);
                                }}
                                className="cursor-pointer"
                              >
                                <Icon size="sm" className="mr-2">
                                  queue
                                </Icon>
                                Add to Queue
                              </DropdownMenuItem>
                              {user && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFavoriteClick(song.id);
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Icon size="sm" className="mr-2">
                                    {isFavorited
                                      ? "favorite"
                                      : "favorite_border"}
                                  </Icon>
                                  {isFavorited
                                    ? "Remove from Favorites"
                                    : "Add to Favorites"}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
