import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function AvatarDemo22() {
  return (
    <div className="flex flex-row flex-wrap items-center gap-12">
      <Avatar className="h-18 w-18 mt--12">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
}
