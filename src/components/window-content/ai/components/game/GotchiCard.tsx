import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GotchiCardProps {
  name: string;
  image: string;
  className?: string;
}

export function GotchiCard({
  name,
  image,
  className,
}: GotchiCardProps) {
  return (
    <Card className={cn("overflow-hidden rounded-md border-2 border-[#dfdfdf] bg-[#e0e0e0] shadow-[inset_-2px_-2px_#a0a0a0,inset_2px_2px_#fff]", className)}>
      <div className="overflow-hidden rounded-md">
        <img
          src={image}
          alt={name}
          className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 text-sm font-bold text-[#000080]">{name}</h3>
        <button
          className="w-full rounded-sm py-2 font-bold text-sm border-2 border-[#b0b0b0] bg-[#c0c0c0] text-black hover:bg-[#d0d0d0] shadow-win98-outer active:shadow-win98-inner transition-all duration-75"
        >
          Pet
        </button>
      </CardContent>
    </Card>
  );
}