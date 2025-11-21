import ImageKit from "imagekit";
import { ENV } from "./env.js";


const imagekit = new ImageKit({
    publicKey: ENV.IMAGEKIT_PUBLIC_KEY, // 'publicKey'
    privateKey: ENV.IMAGEKIT_PRIVATE_KEY, // 'privateKey'
    urlEndpoint: ENV.IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;