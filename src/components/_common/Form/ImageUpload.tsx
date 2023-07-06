import React, { useState } from "react";
import Input, { type InputProps } from "./Input";
import { uploadImage } from "~/server/firebase/images";
import { toast } from "react-hot-toast";
import { CameraIcon } from "../icons";
import Loading from "../Loading";
import { cn } from "~/utils/styleUtils";
import { type Field } from "./Field";
import { Controller } from "react-hook-form";
type ImageUploaderProps = InputProps & {
  onChange?: (url: string) => void;
};
const ImageUploader = ({
  onChange,
  placeholder = "Seleccionar imagen",
  ...props
}: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <label>
      <Input
        hidden
        type={"file"}
        id="image"
        accept={"image/*"}
        disabled={props.disabled ?? uploading}
        onChange={(e) => {
          setUploading(true);
          try {
            if (!e.target.files?.[0])
              throw new Error("No se ha seleccionado un archivo");
            const file = e.target.files[0];
            // check fileMB
            const fileMB = file.size / (1024 * 1024);
            const MAX_FILE_SIZE = 5;
            if (fileMB > MAX_FILE_SIZE) {
              throw new Error(
                `El archivo es demasiado grande, el tamaño máximo es de ${MAX_FILE_SIZE}MB`
              );
            }

            uploadImage(file, (url) => {
              onChange?.(url);
              setFileName(file.name);
              setUploading(false);
            });
            setFileName;
          } catch (err) {
            if (err instanceof Error) {
              toast.error(err.message);
            }
            setUploading(false);
          }
        }}
      />
      <div
        className={cn(
          (props.disabled ?? uploading) &&
            "cursor-not-allowed bg-gray-300 bg-opacity-30 hover:border-gray-400",
          "font-regular relative cursor-pointer rounded-md border border-gray-400 py-3.5  px-5 text-sm outline-none transition-colors duration-300 hover:border-primary focus:ring-1 "
        )}
        {...props}
      >
        {fileName ? (
          <div className="max-w-xs truncate">{fileName}</div>
        ) : (
          <div className="flex justify-between">
            <span className="truncate">{placeholder}</span>
            <CameraIcon className="h-5 w-5 text-gray-600 group-hover:text-primary" />
          </div>
        )}
        {uploading && (
          <Loading
            className="absolute inset-0 "
            kind={"bg-gray-500"}
            size={"md"}
          />
        )}
      </div>
    </label>
  );
};

export const FieldImage = ({ path, ...props }: Field<ImageUploaderProps>) => {
  return (
    <Controller
      name={path}
      render={({ field: { ref, ...field } }) => (
        <ImageUploader {...props} {...field} />
      )}
    />
  );
  /*    <Controller
      name={path}
      render={({ field: { ref, ...field } }) => (
        <Select {...props} {...field} />
      )}
    /> */
};

export default ImageUploader;
