import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Icon from "../ui/icon";
import { useSidebar } from "../ui/sidebar";
import { useAuth } from "@/contexts/auth-context";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState, useRef, useEffect } from "react";
import { Album, Artist } from "@/types";
import { getAlbums, getArtists } from "@/services/media-services";
import { debounce } from "lodash";

type SearchResult = {
  albums: Album[];
  artists: Artist[];
};

function AppNavbar({ className }: { className?: string }) {
  const { openMobile, setOpenMobile } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult>({
    albums: [],
    artists: [],
  });
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search results on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (query: string) => {
      if (!query) {
        setSearchResults({ albums: [], artists: [] });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [albumsData, artistsData] = await Promise.all([
          getAlbums(query),
          getArtists(query),
        ]);

        setSearchResults({
          albums: albumsData.slice(0, 3), // Limit results
          artists: artistsData.slice(0, 3),
        });
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 300),
  ).current;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      setShowResults(true);
      setLoading(true);
      debouncedSearch(query);
    } else {
      setShowResults(false);
      setSearchResults({ albums: [], artists: [] });
    }
  };

  const handleViewAllResults = () => {
    navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
    setShowResults(false);
  };

  return (
    <div className={cn("fixed h-16 w-dvw p-2", className)}>
      <div className="relative flex h-full items-center justify-between">
        <Icon
          size={"xl"}
          onClick={() => setOpenMobile(!openMobile)}
          className="mr-3 md:hidden!"
        >
          menu
        </Icon>
        <Link
          to="/"
          className="hidden h-18 w-18 items-center justify-center text-white md:flex"
        >
          <Icon size={"xl"}>grid_view</Icon>
        </Link>

        <div className="absolute top-1/2 left-1/2 flex -translate-1/2 gap-2">
          <Button className="size-12 cursor-pointer rounded-full bg-neutral-800 text-white hover:bg-neutral-700">
            <NavLink to="/">
              {({ isActive }) => (
                <Icon size={"lg"} fill={isActive}>
                  home
                </Icon>
              )}
            </NavLink>
          </Button>

          {/* Searchbar */}
          <div
            ref={searchRef}
            className="relative flex w-fit rounded-full bg-neutral-800 ring-offset-2 transition-all delay-75 duration-200 focus-within:ring-0 hover:bg-neutral-700"
          >
            <div className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-transparent pl-1 text-white">
              <Icon size="lg">search</Icon>
            </div>
            <div className="hidden md:flex">
              <Input
                placeholder="What do you want to play?"
                className="h-12 w-md border-0 bg-transparent! pl-0! focus-visible:ring-0"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <div className="flex items-center">
                <Separator orientation="vertical" className="h-3/5!" />
              </div>
              <div className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-transparent pr-1 text-white">
                <NavLink to="/explore">
                  {({ isActive }) => (
                    <Icon size={"lg"} fill={isActive}>
                      explore
                    </Icon>
                  )}
                </NavLink>
              </div>
            </div>

            {/* Search Results Dropdown */}
            {showResults &&
              (searchResults.albums.length > 0 ||
                searchResults.artists.length > 0 ||
                loading) && (
                <div className="bg-popover absolute top-full left-0 z-50 mt-2 w-96 rounded-md p-4 shadow-lg">
                  {loading ? (
                    <div className="py-3 text-center">
                      <Icon>hourglass_empty</Icon> Searching...
                    </div>
                  ) : (
                    <>
                      {searchResults.artists.length > 0 && (
                        <div className="mb-4">
                          <h3 className="mb-2 font-semibold">Artists</h3>
                          <div className="space-y-2">
                            {searchResults.artists.map((artist) => (
                              <Link
                                key={artist.id}
                                to={`/artist/${artist.id}`}
                                className="hover:bg-accent flex items-center gap-3 rounded-md p-2"
                                onClick={() => setShowResults(false)}
                              >
                                <div className="size-10 overflow-hidden rounded-full">
                                  <img
                                    src={artist.cover_url}
                                    alt={artist.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {artist.name}
                                  </div>
                                  <div className="text-muted-foreground text-xs">
                                    Artist
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchResults.albums.length > 0 && (
                        <div className="mb-4">
                          <h3 className="mb-2 font-semibold">Albums</h3>
                          <div className="space-y-2">
                            {searchResults.albums.map((album) => (
                              <Link
                                key={album.id}
                                to={`/album/${album.id}`}
                                className="hover:bg-accent flex items-center gap-3 rounded-md p-2"
                                onClick={() => setShowResults(false)}
                              >
                                <div className="size-10 overflow-hidden rounded-md">
                                  <img
                                    src={album.cover_url}
                                    alt={album.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {album.name}
                                  </div>
                                  <div className="text-muted-foreground text-xs">
                                    {album.authorName}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border-t pt-2 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          onClick={handleViewAllResults}
                        >
                          Show all results
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
          </div>
        </div>

        {user ? (
          <Popover>
            <div className="size-12 cursor-pointer">
              <PopoverTrigger>
                <Avatar className="size-full cursor-pointer border">
                  <AvatarImage
                    src={`http://localhost:3001/avatars/${user.username}.png`}
                  />
                  <AvatarFallback>
                    <Icon size={"lg"}>person</Icon>
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-40 rounded-sm p-1">
                <div className="grid gap-1">
                  <Button
                    asChild
                    variant="ghost"
                    className="cursor-pointer rounded-xs"
                  >
                    <Link to="/account" className="justify-start">
                      Settings
                    </Link>
                  </Button>

                  <Separator className="w-full" />

                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="cursor-pointer justify-start! rounded-xs"
                  >
                    Log out
                  </Button>
                </div>
              </PopoverContent>
            </div>
          </Popover>
        ) : (
          <div className="flex gap-2">
            <Button
              asChild
              variant={"outline"}
              className="cursor-pointer rounded-full px-5 py-5 font-semibold"
            >
              <a href="/register" className="inline-flex items-center">
                Sign Up
              </a>
            </Button>
            <Button
              asChild
              className="cursor-pointer rounded-full px-5 py-5 font-semibold"
            >
              <a href="/login" className="inline-flex items-center">
                Log In
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppNavbar;
