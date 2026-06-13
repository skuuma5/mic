let mediaRecorder;
let audioChunks = [];

const recordBtn = document.getElementById("recordBtn");
const audio = document.getElementById("audio");

let stream;

recordBtn.addEventListener("mousedown", async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.start();
    console.log("Recording started...");

    mediaRecorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };

  } catch (err) {
    console.log("Mic permission denied", err);
  }
});

recordBtn.addEventListener("mouseup", () => {
  if (!mediaRecorder) return;

  mediaRecorder.stop();

  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    const audioUrl = URL.createObjectURL(audioBlob);

    audio.src = audioUrl;

    console.log("Recording saved");

    // stop mic stream (important)
    stream.getTracks().forEach(track => track.stop());
  };
});