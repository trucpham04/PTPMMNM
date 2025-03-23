import { cn } from "@/lib/utils";
import { Slider } from "../ui/slider";
import Icon from "../ui/icon";

export default function AppFooter({ className }: { className?: string }) {
  return (
    <>
      <div
        className={cn(
          "bg--100 relative flex h-16 items-center justify-between p-2",
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <div className="size-14 rounded-md bg-white"></div>
          <div className="space-y-">
            <div>Track name</div>
            <div className="text-xs">artist name</div>
          </div>
          <Icon>add_circle</Icon>
        </div>
        <div className="absolute top-2/5 left-1/2 flex w-full -translate-1/2 flex-col items-center justify-center">
          <div className="flex gap-4">
            <Icon size="xl">skip_previous</Icon>
            <Icon size="xl">play_arrow</Icon>
            <Icon size="xl">skip_next</Icon>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div>0:00</div>
            <Slider className="w-1/4 min-w-80" />
            <div>3:09</div>
          </div>
        </div>
        {/* </div> */}
        <div className="flex gap-2">
          <Icon size="lg">volume_up</Icon>
          <Slider
            size="small"
            max={100}
            defaultValue={[100]}
            className="w-20"
          />
        </div>
      </div>
    </>
  );
}
