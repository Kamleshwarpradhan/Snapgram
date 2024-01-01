import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";

type FileUploaderProps = {
    fieldChange: (FILES: File[]) => void;
    mediaUrl: string;
}

const FileUploaderForProfile = ({fieldChange,mediaUrl}:FileUploaderProps) => {

  const [file, setFile] = useState<File[]>([])
  const [FileUrl, setFileUrl] = useState(mediaUrl)

  const onDrop = useCallback((acceptedFiles:FileWithPath[]) => {
    // Do something with the files
     setFile(acceptedFiles);
     fieldChange(acceptedFiles);
     setFileUrl(URL.createObjectURL(acceptedFiles[0]))
  }, [file])
  const {getRootProps, getInputProps} = useDropzone({
  onDrop,
  accept: {
     "image/*" : [".png",".jpeg",".jpg",".svg"]
  }
})

  return (
    <div {...getRootProps()} className='flex flex-col bg-dark-3 rounded-xl cursor-pointer'>
    <input {...getInputProps()} className='cursor-pointer' />
         <div className='flex p-5 lg:p-8 gap-5'>
             <img 
              src = {FileUrl}
              alt="Uploaded Images"
              className='w-32 h-32 rounded-full'
              />
             <Button className='shad-button_ghost self-center text-primary-500'>Change Profile Photo</Button>     
         </div>
  </div>
  )
}

export default FileUploaderForProfile