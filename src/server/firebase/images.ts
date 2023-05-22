import { storage } from "./index";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export function uploadImage(file: File, onChange: (url: string) => void) {
  const extension = file.type.split("/")[1] as string;

  const storageRef = ref(storage, `images/${Date.now()}.${extension}`);

  const metadata = {
    contentType: `image/${extension}`,
  };

  //  start uploading
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  uploadTask.on(
    "state_changed",
    () => {
      return;
    },
    (_error) => {
      console.log(_error);
    },
    () => {
      void getDownloadURL(uploadTask.snapshot.ref).then(onChange);
    }
  );
}
