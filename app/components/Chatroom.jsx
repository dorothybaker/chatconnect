import { useEffect, useRef, useState } from "react";
import MessageCard from "./MessageCard";
import MessageInput from "./MessageInput";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import MobileUsers from "./MobileUsers";

export default function Chatroom({
  user,
  selectedChatroom,
  setSelectedChatroom,
}) {
  const me = selectedChatroom?.myData;
  const other = selectedChatroom?.otherData;
  const chatroomId = selectedChatroom?.id;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);
  const messageContainer = useRef(null);

  const sendMessage = async (e) => {
    const messageCollection = collection(firestore, "messages");

    if (message.trim() === "" && !image) return;

    try {
      const messageData = {
        chatroomId,
        senderId: me?.id,
        content: message,
        time: serverTimestamp(),
        image: image,
        messageType: "text",
      };

      await addDoc(messageCollection, messageData);
      setMessage("");
      setImage(null);

      const chatroomRef = doc(firestore, "chatrooms", chatroomId);
      await updateDoc(chatroomRef, {
        latestMessage: message ? message : "Image",
        time: serverTimestamp(),
      });
    } catch (error) {
      console.log(error);
    }

    if (messageContainer.current) {
      messageContainer.current.scrollTop =
        messageContainer.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (!chatroomId) return;

    const unsubscribe = onSnapshot(
      query(
        collection(firestore, "messages"),
        where("chatroomId", "==", chatroomId),
        orderBy("time", "asc")
      ),
      (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);
      }
    );

    return unsubscribe;
  }, [chatroomId]);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (messageContainer.current) {
      messageContainer.current.scrollTop =
        messageContainer.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="md:w-[550px] flex flex-col w-full h-full">
      <>
        <div className="border-b flex justify-between items-center p-2 bg-background w-full">
          {other ? (
            <>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={other.avatarUrl} />
                </Avatar>
                <h1 className="font-semibold text-lg line-clamp-1">
                  {other.name}
                </h1>
              </div>
            </>
          ) : (
            <div className="p-2" />
          )}

          <div className="md:hidden block justify-self-end">
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <button
              className="bg-primary text-white rounded-md py-1 px-2 font-semibold"
              onClick={() => document.getElementById("my_modal_1").showModal()}
            >
              Menu
            </button>
            <dialog id="my_modal_1" className="modal">
              <div className="modal-box p-2">
                <h1 className="font-semibold p-3 text-xl text-primary">
                  ChatConnect
                </h1>
                <MobileUsers
                  setSelectedChatroom={setSelectedChatroom}
                  userData={user}
                />
                <div className="modal-action mt-auto">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="font-semibold px-3 py-1.5 border-2 rounded-lg text-sm border-foreground/50 cursor-pointer">
                      Close
                    </button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        </div>

        <div className="flex-1 overflow-auto py-2" ref={messageContainer}>
          {selectedChatroom ? (
            <div className="flex flex-col gap-3 sm:px-4 px-2">
              {messages.map((message) => (
                <MessageCard
                  message={message}
                  key={message.id}
                  me={me}
                  other={other}
                  image={image}
                  setImage={setImage}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3 flex-1 justify-center items-center w-full h-full">
              <img
                src="https://www.svgrepo.com/show/95354/chat.svg"
                alt=""
                className="h-10 w-10"
              />
              <h1 className="text-2xl font-semibold text-primary">
                ChatConnect
              </h1>
              <div className="text-center">
                <h2 className="text-xl font-semibold">
                  Welcome ✨<span className="text-primary">{user?.name}</span>✨
                </h2>
                <p className="text-lg font-semibold text-foreground/60">
                  Select a user to start chatting!
                </p>
              </div>
            </div>
          )}
        </div>

        <MessageInput
          sendMessage={sendMessage}
          message={message}
          setMessage={setMessage}
          setImage={setImage}
          image={image}
          selectedChatroom={selectedChatroom}
        />
      </>
    </div>
  );
}
