const qs = (e) => document.querySelector(e);

const inputImg = qs("#inputImg");
const img = qs("#img-square img");
const imgSquare = qs("#img-square");
const rectangle = qs("#rectangle-image");
const holder = qs("#img-holder");

inputImg.addEventListener("change", function (e) {
  console.log("Imagem selecionada");
  loadImg(e.target.files);
});

function loadImg(image) {
  if (image && image[0]) {
    imgSquare.style.width = 0;
    imgSquare.style.height = 0;
    const reader = new FileReader();
    reader.onload = function (event) {
      img.onload = function () {
        imgSquare.style.width = `${img.naturalWidth}px`;
        imgSquare.style.height = `${img.naturalHeight}px`;

        // Ajusta o tamanho de imgSquare para a imagem carregada
        if (img.naturalWidth > 500) {
          const aspectRatio = img.naturalHeight / img.naturalWidth;
          img.style.width = "500px";
          img.style.height = `${500 * aspectRatio}px`;
          imgSquare.style.width = "500px";
          imgSquare.style.height = `${500 * aspectRatio}px`;
        } else {
          img.style.width = `${img.naturalWidth}px`;
          img.style.height = `${img.naturalHeight}px`;
        }

        rectangle.style.top = holder.offsetHeight;

        setHeight();
      };
      img.src = event.target.result; // Define a fonte da imagem
    };
    reader.readAsDataURL(image[0]); // Lê o arquivo como Data URL
  } else {
    console.log("Nenhum arquivo selecionado.");
  }
}

function setHeight() {
  // Ajusta a altura do contêiner imgSquare
  const result =
    holder.offsetHeight / Math.round(parseFloat(img.style.height).toFixed(2));
  const percentage = result * 100;
  rectangle.style.display = "flex";
  rectangle.innerHTML = `${percentage.toFixed(2)} %`; // Exibe a porcentagem de diferença
}

let isDragging = false;
let startY;
let initialTop;

rectangle.addEventListener("mousedown", (e) => {
  e.preventDefault();
  isDragging = true;
  startY = e.clientY;
  initialTop = rectangle.offsetTop;
  rectangle.style.transition = "none"; // Remove transição durante o arraste
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const deltaY = e.clientY - startY;
    let newTop = initialTop + deltaY;

    // Limite do contêiner
    const container = rectangle.parentElement;
    const maxTop = container.offsetHeight - rectangle.offsetHeight;
    newTop = Math.max(-20, Math.min(maxTop, newTop));
    holder.style.height = newTop + 20 + "px";
    rectangle.style.top = newTop + 20 + "px";
    setHeight(); // Exibe a porcentagem de diferença
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  rectangle.style.transition = "top 0.2s ease"; // Reaplica uma leve transição ao soltar
});
