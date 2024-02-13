import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="md:w-[500px] w-full shadow-md rounded-md p-2 flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <img
            src="https://www.svgrepo.com/show/95354/chat.svg"
            alt="logo"
            width={30}
          />
          <h1 className="text-xl font-semibold text-primary">ChatConnect</h1>
        </div>
        <h2 className="text-foreground/80 font-semibold">
          Welcome to ChatConnect!
        </h2>
        <p>
          ChatConnect is an innovative and user-friendly chat application,
          designed to effortlessly connect individuals from all walks of life.
          Whether you're looking to connect with friends, family, or meet new
          people, ChatConnect provides a secure and seamless platform for
          meaningful conversations.
        </p>
        <p>
          Join ChatConnect today and start building lasting connections,
          discovering new perspectives, and fostering friendships that transcend
          boundaries. So, what are you waiting for? Let's ChatConnect!
        </p>

        <Link href="/login">
          <Button className="bg-primary font-semibold w-full">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}
