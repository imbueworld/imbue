import storage from '@react-native-firebase/storage'
import ImagePicker from "react-native-image-picker"
const bucketName = "spring-ranger-281214.appspot.com"

export function onUserUpload() {
  ImagePicker.showImagePicker(null, res => {
    if (res.didCancel) {
      const err = new Error("Upload cancelled.")
      err.code = "canceled"
      throw err
    }
    else if (res.error) {
      const err = new Error("Upload failed.")
      err.code = "failed"
      throw err
    } else {
      const fileName = fileObj.fileName
      console.log("data", res.data)
      console.log("fileSize", res.fileSize)
      console.log("origURL", res.origURL)
      console.log("path", res.path)
      console.log("type", res.type)
      console.log("uri", res.uri)
      return

      // Multer is required to process file uploads and make them available via
      // req.files.
      // const multer = Multer({
      //     storage: Multer.memoryStorage(),
      //     limits: {
      //         fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
      //     },
      // });
      //
      // Multer may not be needed thanks to react-native-image-picker

      const bucket = storage.bucket(bucketName)

      // Create a new blob in the bucket and upload the file data.
      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      blobStream.on('error', err => {
        // const err = new Error("Uploading was not possible during this time.")
        // err.code = "failed"
        throw err
      });
      
      blobStream.on('finish', () => {
        console.log("Finished")
      });

      blobStream.end(res.fileSize);
    }
  })
}