document.addEventListener("DOMContentLoaded", async () => {
  const fileInput = document.getElementById("fileInput");
  const convertButton = document.getElementById("convertButton");
  const label = document.getElementById("labelText");

  fileInput.addEventListener("change", function (e) {
    if (e.target.files[0]) {
      label.textContent = e.target.files[0].name;
    } else {
      label.textContent = "Select a file";
    }
  });

  convertButton.addEventListener("click", async () => {
    const selectedFile = fileInput.files[0];
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    const { name } = selectedFile;
    const inputPcap = await selectedFile.arrayBuffer();

    const message = {
      data: Array.from(new Uint8Array(inputPcap)),
      action: "convert",
    };

    chrome.runtime.sendMessage(message, (response) => {
      if (!response.bytes) {
        alert("Failed to convert .pcap file.");
        return;
      }

      download(new Uint8Array(response.bytes).buffer, name);
    });
  });
});

function download(bytes, filename) {
  const blob = new Blob([bytes], {
    type: "application/octet-stream",
  });
  const url = URL.createObjectURL(blob);

  chrome.downloads.download(
    {
      url: url,
      filename: `${filename || "output"}.hc22000`,
      saveAs: true,
    },
    (downloadId) => {
      if (!downloadId) {
        alert("Unable to download file.");
      }
    }
  );
}
