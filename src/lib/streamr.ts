import StreamrClient from "streamr-client";

console.log(import.meta.env.VITE_PRIVATE_KEY);

const client = new StreamrClient({
  auth: {
    privateKey: import.meta.env.VITE_PRIVATE_KEY as string,
  },
});

client.onError = (error) => console.log(error.stack);

export default client;
