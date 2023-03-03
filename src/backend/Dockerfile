# Use the Python Alpine image
FROM python:3.10-slim-bullseye

RUN apt-get update && apt-get install -y libsndfile1 ffmpeg
# Set the working directory to /app
WORKDIR /app

# Copy the backend code into the container (temporary)
COPY . .

# Install the dependencies
RUN pip install -r requirements.txt

# Expose port 8000
EXPOSE 8000

# Start the FastAPI server
CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]