let mediaRecorder;
let audioChunks = [];
let stream;
let isRecording = false;

const recordBtn = document.getElementById("recordBtn");
const audio = document.getElementById("audio");

recordBtn.addEventListener("click", async () => {

  if (!isRecording) {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.start();
      isRecording = true;

      recordBtn.innerText = "Stop";
      console.log("Recording started...");

      mediaRecorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };

    } catch (err) {
      console.log("Mic permission denied", err);
    }
  }

  // ⏹ STOP RECORDING
  else {
    mediaRecorder.stop();
    isRecording = false;

    recordBtn.innerText = "Start";

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);

      audio.src = audioUrl;

      console.log("Recording saved");

      // stop mic properly
      stream.getTracks().forEach(track => track.stop());
    };
  }
});