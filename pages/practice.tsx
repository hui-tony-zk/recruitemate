import { useState, useEffect, useRef } from "react";

const TranscribeAudio = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [userText, setUserText] = useState("");

  useEffect(() => {
    const audioContext = new AudioContext();
    let audioBufferSourceNode;

    function handleUserTextData(jsonData: string) {
      const parsedData = JSON.parse(jsonData);
      const text = parsedData.user_text;
    
      if (text) {
        let currentTextIndex = 0;
    
        const intervalId = setInterval(() => {
          if (currentTextIndex < text.length) {
            setUserText((prevUserText) => {
              return prevUserText + text[currentTextIndex];
            });
            currentTextIndex++;
          } else {
            clearInterval(intervalId);
          }
        }, 50);
      }
    }

    function handleAudioData(jsonData: string) {
      const parsedData = JSON.parse(jsonData);
      const audioData = parsedData.audio_data;
    
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
    
        // Update the transcript textarea as the audio is being played
        const text = parsedData.ai_text;
        console.log('here is the parsed text')
        console.log(typeof text)
        console.log(text)
        let currentTextIndex = transcribedText.length;
    
        const intervalId = setInterval(() => {
          console.log('the Interval ID is')
          console.log(intervalId)
          if (currentTextIndex < text.length) {
            setTranscribedText((prevTranscribedText) => {
              return prevTranscribedText + text[currentTextIndex];
            });
            currentTextIndex++;
            console.log('the newText')
            console.log(text)
          } else {
            clearInterval(intervalId);
          }
        }, 50);
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
      
      const jsonData = JSON.parse(event.data);
      
      if (jsonData.hasOwnProperty("audio_data")) {
        handleAudioData(event.data);
      } else if (jsonData.hasOwnProperty("user_text")) {
        handleUserTextData(event.data);
      }
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Question Prompt: Tell me about yourself?</h1>
      <p id="status">Connection status will go here</p>
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <div style={{ marginRight: "1rem" }}>
          <p>You say:</p>
          <textarea
            rows="10"
            cols="50"
            value={userText}
            readOnly
            style={{ color: "black" }}
          />
        </div>
        <div>
          <p>Mockterview Says:</p>
          <textarea
            id="transcript"
            rows="10"
            cols="50"
            value={transcribedText}
            readOnly
            style={{ color: "black" }}
          />
        </div>
      </div>
      <button onClick={handleSendButtonClick}>
        {isRecording ? "Send Recording" : "Start Recording"}
      </button>
    </div>
  );
};

export default TranscribeAudio;