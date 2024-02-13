import React, { useState } from "react";
import { FaPaperclip, FaPaperPlane } from "react-icons/fa";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/lib/firebase";
import EmojiPicker from "emoji-picker-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

function MessageInput({
  sendMessage,
  message,
  setMessage,
  image,
  setImage,
  selectedChatroom,
}) {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Initialize storage object
  const storage = getStorage(app);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Display image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading file:", error.message);
      },
      () => {
        // Upload complete, get download URL and log it
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          // Reset file state and update message with download URL
          setFile(null);
          setImage(downloadURL);
          // Clear image preview
          setImagePreview(null);
          setUploadProgress(0);
        });
      }
    );
  };

  const handleEmojiClick = (emojiData, event) => {
    // Append the selected emoji to the message state
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
  };

  return (
    <div className="relative flex items-center p-2 border-t">
      <Dialog>
        <DialogTrigger>
          <FaPaperclip
            className={`${
              image ? "text-primary" : "text-gray-500"
            } mr-2 cursor-pointer`}
          />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload your image</DialogTitle>
            <DialogDescription>
              Click on the upload image box to select an image.
            </DialogDescription>
          </DialogHeader>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Uploaded"
              className="max-h-60 w-full object-cover my-4 rounded-sm"
            />
          )}
          <label htmlFor="fileImage">
            {imagePreview ? (
              <span className="text-primary text-[16.5px] font-semibold">
                Image successfully uploaded
              </span>
            ) : (
              <div className="border-2 w-full cursor-pointer h-24 border-dashed flex items-center justify-center font-semibold">
                Upload Image Box
              </div>
            )}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="fileImage"
            className="hidden"
          />

          <Button className="bg-primary" onClick={() => handleUpload()}>
            Upload
          </Button>
          <Progress value={uploadProgress} className="w-full" />
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Emoji Picker Button */}
      <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        type="text"
        placeholder="Type a message..."
        className="flex-1 border-none outline-none ml-1"
      />

      {selectedChatroom && (
        <FaPaperPlane
          onClick={() => sendMessage()}
          className="text-primary cursor-pointer ml-2"
        />
      )}

      {showEmojiPicker && (
        <div className="absolute right-0 bottom-full p-2">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            disableAutoFocus={true}
            width="100%"
          />
        </div>
      )}
    </div>
  );
}

export default MessageInput;
