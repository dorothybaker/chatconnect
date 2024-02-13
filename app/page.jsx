"use client";

import { app, firestore } from "@/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Users from "./components/Users";
import Chatroom from "./components/Chatroom";

export default function Home() {
  const auth = getAuth(app);
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [selectedChatroom, setSelectedChatroom] = useState(null);

  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        // prettier-ignore
        const userData = ({ id: userSnap.id, ...userSnap.data() });
        setUser(userData);
      } else {
        setUser(null);
        router.push("/getstarted");
      }
    });

    return () => unsubcribe();
  }, [auth, router]);

  return (
    <div className="flex overflow-hidden sm:h-[450px] md:h-[550px] h-[97vh] lg:w-[800px] md:w-[700px] w-full mx-auto shadow-lg rounded-lg border">
      <Users userData={user} setSelectedChatroom={setSelectedChatroom} />

      <Chatroom
        user={user}
        selectedChatroom={selectedChatroom}
        setSelectedChatroom={setSelectedChatroom}
      />
    </div>
  );
}
