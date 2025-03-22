import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

export default function AlbumAction() {
  return (
    <>
      <div className="m-4 flex items-center gap-4">
        <Button className="size-15 rounded-full">
          <Icon size="xl" fill>
            play_arrow
          </Icon>
        </Button>

        <Button className="size-8 rounded-full">
          <Icon>add</Icon>
        </Button>
      </div>
    </>
  );
}
