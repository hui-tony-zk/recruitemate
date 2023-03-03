import uvicorn
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
from pydub.silence import split_on_silence
import io
import os
import soundfile as sf
import pydub

app = FastAPI()

@app.websocket("/practice")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        buffer = io.BytesIO()
        while True:
            data = await websocket.receive_bytes()
            buffer.write(data)
            audio = pydub.AudioSegment.from_raw(buffer, sample_width=2, frame_rate=44100, channels=1)
            segments = split_on_silence(audio, min_silence_len=1000, silence_thresh=-50)
            
            # Convert each segment into an mp3 file (Temporarily till we bring it bytestream in-memory)
            for i, segment in enumerate(segments):
                output_path = f"output_{i}.mp3"
                segment.export(output_path, format="mp3")
                
                # Remove the output file if it's too small (i.e., contains only silence)
                if os.path.getsize(output_path) < 1000:
                    os.remove(output_path)
            
            # Reset the buffer to prepare for the next chunk of audio data
            buffer.seek(0)
            buffer.truncate()
    except Exception as e:
        raise Exception(f'Could not process audio: {e}')
    finally:
        await websocket.close()


if __name__ == '__main__':
    uvicorn.run(app)