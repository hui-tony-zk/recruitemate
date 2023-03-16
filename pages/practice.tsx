import { useState, useEffect } from "react";

const TranscribeAudio = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const audioContext = new AudioContext();
    let audioBufferSourceNode;

    function handleAudioData(audioData: string) {
      // Convert the base64-encoded audio data to a binary string
      const binaryString = window.atob(audioData);

      // Convert the binary string to a typed array
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Decode the typed array into an AudioBuffer
      audioContext.decodeAudioData(bytes.buffer, (buffer: AudioBuffer) => {
        // Create a new AudioBufferSourceNode
        const source = audioContext.createBufferSource();
        source.buffer = buffer;

        // Connect the AudioBufferSourceNode to the AudioContext output
        source.connect(audioContext.destination);

        // Start playing the audio
        source.start();
      });
    }

    const question = "Tell me about yourself"; // default question

    const socket = new WebSocket(`ws://127.0.0.1:8000/practice?question=${question}`);
    setSocket(socket);

    socket.onopen = () => {
      console.log({ event: "onopen" });
      document.querySelector("#status").textContent = "Connected";
    };

    socket.onclose = () => {
      console.log({ event: "onclose" });
    };

    socket.onerror = (error) => {
      console.log({ event: "onerror", error });
    };

    socket.onmessage = async (event) => {
      console.log({ event: "onmessage", data: event.data });
      handleAudioData(event.data);
    };

    navigator.mediaDevices
      .getUserMedia({
        audio: { sampleSize: 16, channelCount: 1, sampleRate: 44100 },
      })
      .then((stream) => {
        if (!MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          return alert("Browser not supported");
        }
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm;codecs=opus",
        });
        setMediaRecorder(mediaRecorder);
      });
  }, []);

  const handleSendButtonClick = () => {
    if (!mediaRecorder) {
      console.log('mediarecorder not working')
      return;
    }
  
    if (isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      return;
    }
  
    const chunks = [];
    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };
  
    mediaRecorder.onstop = () => {
      console.log('mediarecorder stopped')
      const audioBlob = new Blob(chunks, { type: "audio/webm;codecs=opus" });
      socket.send(audioBlob);
    };
  
    mediaRecorder.start(250);
    setIsRecording(true);
  };

  return (
    <>
      <h1>Practice Audio</h1>
      <p id="status">Connection status will go here</p>
      <p id="transcript"></p>
      <button onClick={handleSendButtonClick}>
        {isRecording ? "Stop" : "Send"}
      </button>
    </>
  );
};

export default TranscribeAudio;