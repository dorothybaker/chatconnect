import moment from "moment";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: "500" });

export default function MessageCard({ message, me, other }) {
  const isMessageFromMe = message.senderId === me.id;

  const timeFormat = (time) => {
    const date = time?.toDate();
    const momentDate = moment(date).format("LT");
    return momentDate;
  };

  return (
    <div
      key={message.id}
      className={`${isMessageFromMe ? "chat-end" : "chat-start"} chat w-full`}
    >
      <div
        className={`${
          isMessageFromMe ? "bg-gray-600" : "bg-primary"
        } text-background w-max max-w-[600px] p-2 chat-bubble`}
      >
        {message.image && (
          <img
            src={message.image}
            className="w-60 h-60 rounded-md object-cover"
          />
        )}
        <p className="text-[15px]">{message.content}</p>
        <span
          className={`text-[10px] text-background/80 block ${inter.className} ${
            isMessageFromMe ? "text-start" : "text-end"
          }`}
        >
          {timeFormat(message.time)}
        </span>
      </div>
    </div>
  );
}
