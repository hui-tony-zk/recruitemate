import { useEffect } from "react";

const TranscribeAudio = () => {
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: { sampleSize: 16, channelCount: 1, sampleRate: 16000 },
      })
      .then((stream) => {
        if (!MediaRecorder.isTypeSupported("audio/webm")) {
          return alert("Browser not supported");
        }
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });
        //Needs to pull from a environment based config
        const socket = new WebSocket("ws://localhost:8000/practice");

        socket.onopen = () => {
          console.log({ event: "onopen" });
          document.querySelector("#status").textContent = "Connected";
          mediaRecorder.addEventListener("dataavailable", async (event) => {
            if (event.data.size > 0 && socket.readyState === 1) {
              socket.send(event.data);
            }
          });
          mediaRecorder.start(250);
        };

        socket.onclose = () => {
          console.log({ event: "onclose" });
        };

        socket.onerror = (error) => {
          console.log({ event: "onerror", error });
        };
      });
  }, []);

  return (
    <>
      <h1>Practice Audio</h1>
      <p id="status">Connection status will go here</p>
      <p id="transcript"></p>
    </>
  );
};

export default TranscribeAudio;