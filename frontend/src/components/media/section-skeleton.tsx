import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SectionSkeleton() {
  return (
    <Card className="overflow-hidden border-0">
      <CardContent className="p-0">
        <Skeleton className="aspect-square w-full rounded-full" />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 p-0">
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-3 w-[60%]" />
      </CardFooter>
    </Card>
  );
}
