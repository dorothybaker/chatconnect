import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function UserCard({
  name,
  latestMessage,
  avatarUrl,
  time,
  type,
}) {
  return (
    <div className="flex items-center border-b border-b-gray-200 gap-3 py-1 w-full cursor-pointer">
      <Avatar>
        <AvatarImage src={avatarUrl} />
      </Avatar>
      <div className="w-full flex-col gap-1">
        <div className="flex justify-between font-semibold">
          <h1 className={`${time ? "text-sm" : "text-base font-semibold"}`}>
            {name}
          </h1>
          {time && <span className="text-sm">{}</span>}
        </div>
        {type === "chat" && (
          <p className="font-medium text-foreground/80 text-sm line-clamp-1">
            {latestMessage}
          </p>
        )}
      </div>
    </div>
  );
}
