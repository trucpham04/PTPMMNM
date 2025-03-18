import { cn } from "@/lib/utils";
import {
  PlusCircle,
  ChevronFirst,
  ChevronLast,
  Pause,
  Volume1,
  Volume2,
  VolumeX,
  Play,
} from "lucide-react";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";

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
          <PlusCircle className="cursor-pointer" size={20} />
        </div>
        <div className="absolute top-1/2 left-1/2 flex w-full -translate-1/2 flex-col items-center justify-center gap-1">
          {/* <div className="w-fit"> */}
          <div className="flex gap-4">
            <ChevronFirst />
            <Play />
            {/* <Pause /> */}
            <ChevronLast />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div>0:00</div>
            <Slider className="w-1/4 min-w-80" />
            <div>3:09</div>
          </div>
        </div>
        {/* </div> */}
        <div className="flex">
          <Volume1 />
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
