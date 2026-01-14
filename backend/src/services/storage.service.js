import fs from "fs";
import ImageKit from "@imagekit/nodejs";

let client;

const getClient = () => {
  if (!client) {
    client = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  }
  return client;
};

const uploadFile = async (file, fileName) => {
  try {
    const imagekit = getClient();
    const response = await imagekit.files.upload({
      file:  fs.createReadStream(file),
      fileName: fileName,
    });
    return response;

  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw error;
  }
};

export default { uploadFile };
