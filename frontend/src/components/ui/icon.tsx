import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const iconVariants = cva(
  "material-symbols-rounded inline-flex! items-center! justify-center!",
  {
    variants: {
      size: {
        xs: "text-lg!",
        sm: "text-xl!",
        md: "text-2xl!",
        lg: "text-3xl!",
        xl: "text-4xl!",
        "2xl": "text-5xl!",
      },
      fill: {
        true: "fill",
      },
      flip: {
        vertical: "scale-x-[-1]!",
        horizontal: "scale-y-[-1]!",
        both: "scale-x-[-1]! scale-y-[-1]!",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
export default function Icon({
  className,
  children,
  size,
  fill,
  flip,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof iconVariants>) {
  return (
    <span
      className={cn("", iconVariants({ size, fill, flip }), className)}
      {...props}
    >
      {children}
    </span>
  );
}
