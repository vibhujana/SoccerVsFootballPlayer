const imageBox = document.getElementById('image-box');
const dragDropText = document.getElementById('drag-drop');
const imagePreview = document.getElementById('image-preview');
const predictButton = document.getElementById('predict-button');
const resultDiv = document.getElementById('result');

let imageData;

// Drag and drop functionality
imageBox.addEventListener('dragover', (e) => {
  e.preventDefault();
  imageBox.style.border = '2px solid gray';
});

imageBox.addEventListener('dragleave', () => {
  imageBox.style.border = '2px dashed gray';
});

imageBox.addEventListener('drop', (e) => {
  e.preventDefault();
  imageBox.style.border = '2px dashed gray';

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      imagePreview.src = reader.result;
      dragDropText.style.display = 'none';
      imageData = reader.result.replace(/^data:image\/[a-z]+;base64,/, "");
    };
    reader.readAsDataURL(file);
  }
});

// Predict button click handler
predictButton.addEventListener('click', async () => {
  if (!imageData) {
    alert('Please select an image.');
    return;
  }

  const data = {
    data: [
      `data:image/png;base64,${imageData}`
    ]
  };

  try {
    const response = await fetch('https://vibhujana-soccervsfootball.hf.space/run/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();
    const { data: prediction, duration } = responseData;

    const label = prediction[0].label;
    let confidences = '';
    if (prediction[0].confidences) {
      confidences = prediction[0].confidences.map((item) => `${item.label}: ${item.confidence.toFixed(2
