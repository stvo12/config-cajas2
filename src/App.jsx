import { useMemo, useRef, useEffect, useState } from "react";
import { Camera, Copy, Download, MessageCircle, Palette } from "lucide-react";
import * as htmlToImage from "html-to-image";
import ColorPicker from "./components/ColorPicker";
import ProductPreview from "./components/ProductPreview";
import "./App.css";

const COLORS = [
  { name: "Rojo", value: "#e31d1a" },
  { name: "Negro", value: "#171717" },
  { name: "Blanco", value: "#ffffff" },
  { name: "Celeste", value: "#18a9d3" },
  { name: "Morado", value: "#6e35b8" },
  { name: "Rosado", value: "#f08caf" },
];

const WHATSAPP_NUMBER = "50241491343";
const INSTAGRAM_URL = "https://ig.me/m/the3dlab_gt";

function colorName(hex) {
  return COLORS.find((color) => color.value === hex)?.name ?? hex;
}

export default function App() {
  const [mainColor, setMainColor] = useState("#18a9d3");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  const [quantity, setQuantity] = useState(1);

  const [deviceType, setDeviceType] = useState("desktop");

  const previewRef = useRef(null);

  const [generatedImage, setGeneratedImage] = useState(null);

  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isTouch = window.matchMedia("(pointer: coarse)").matches;

      if (width <= 640) {
        setDeviceType("mobile");
      } else if (width <= 1024 || isTouch) {
        setDeviceType("tablet");
      } else if (width > height * 1.6) {
        setDeviceType("wide");
      } else {
        setDeviceType("desktop");
      }
    };

    detectDevice();

    window.addEventListener("resize", detectDevice);

    return () => window.removeEventListener("resize", detectDevice);
  }, []);

  const orderText = useMemo(() => {
    return `Hola, quiero pedir una caja personalizada.\n\nColor principal: ${colorName(mainColor)}\nColor secundario: ${colorName(secondaryColor)}\nCantidad: ${quantity}\n\nAdjunto la imagen de referencia generada en la página.`;
  }, [mainColor, secondaryColor, quantity]);

  const copyOrder = async () => {
    await navigator.clipboard.writeText(orderText);
    alert("Pedido copiado al portapapeles");
  };

  const openInstagram = async () => {
    try {
      await navigator.clipboard.writeText(orderText);
      window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error(error);
      alert(
        "No se pudo copiar el pedido. Puedes copiarlo manualmente con el botón de copiar."
      );
      window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer");
    }
  };

  const generateImageData = async () => {
    const dataUrl = await htmlToImage.toPng(previewRef.current, {
      pixelRatio: 3,
      backgroundColor: "#ffffff",
      cacheBust: true,
    });

    const fileName = `caja-${colorName(mainColor)}-${colorName(secondaryColor)}.png`;

    const response = await fetch(dataUrl);
    const blob = await response.blob();

    const file = new File([blob], fileName, {
      type: "image/png",
    });

    return { dataUrl, fileName, file };
  };

  const generatePreviewImage = async () => {
    try {
      const { dataUrl } = await generateImageData();
      setGeneratedImage(dataUrl);
    } catch (error) {
      console.error(error);
      alert("No se pudo generar la imagen. Intenta de nuevo.");
    }
  };

  const downloadImage = async () => {
    try {
      const { dataUrl, fileName, file } = await generateImageData();

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Caja personalizada",
          text: "Imagen de referencia de mi caja personalizada.",
          files: [file],
        });

        return;
      }

      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error(error);
      alert("No se pudo descargar la imagen. Intenta de nuevo.");
    }
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderText)}`;

  return (
    <main className={`site ${deviceType}`}>
      <section className="heroSection">
        <div className="heroCopy">
          <div className="badge">
            <Palette size={16} />
            Personalizador de cajas
          </div>

          <h1>Diseña tu caja antes de pedirla</h1>

          <p>
            Escoge el color del cuerpo y el color de los detalles. Genera una imagen de referencia
            y envía el pedido listo por mensaje.
          </p>
        </div>
      </section>

      <section className="appGrid">
        <section className="previewShell">
          <div className="previewHeader">
            <div>
              <span>Vista previa</span>

              <h2>
                Caja {colorName(mainColor)} con detalles {colorName(secondaryColor)}
              </h2>
            </div>
          </div>

          <div ref={previewRef} className="exportCard">
            <ProductPreview
              mainColor={mainColor}
              secondaryColor={secondaryColor}
            />
          </div>
        </section>

        <aside className="configPanel">
          <div className="card">
            <h2>Personalización</h2>

            <ColorPicker
              title="Color principal"
              subtitle="Cuerpo de la caja"
              colors={COLORS}
              value={mainColor}
              onChange={setMainColor}
              colorName={colorName}
            />

            <ColorPicker
              title="Color secundario"
              subtitle="Números, clips y separador"
              colors={COLORS}
              value={secondaryColor}
              onChange={setSecondaryColor}
              colorName={colorName}
            />

            <label className="quantityBox">
              <div>
                <strong>Cantidad</strong>
                <span>Unidades a solicitar</span>
              </div>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(event) =>
                  setQuantity(Math.max(1, Number(event.target.value)))
                }
              />
            </label>
          </div>

          <div className="card">
            <h2>Pedido generado</h2>

            <pre className="orderBox">{orderText}</pre>

            <div className="actions">
              <button onClick={copyOrder} className="button dark">
                <Copy size={18} />
                Copiar pedido
              </button>

              <button onClick={downloadImage} className="button">
                <Download size={18} />
                Descargar / compartir imagen
              </button>

              <button onClick={generatePreviewImage} className="button">
                <Download size={18} />
                Generar imagen para guardar
              </button>

              {generatedImage && (
                <div className="generatedImageBox">
                  <p>
                    En móvil, mantén presionada la imagen y usa “Guardar en Fotos”
                    o “Guardar imagen”.
                  </p>

                  <img
                    src={generatedImage}
                    alt="Caja personalizada generada"
                    className="generatedImage"
                  />
                </div>
              )}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="button"
              >
                <MessageCircle size={18} />
                Enviar por WhatsApp
              </a>

              <button onClick={openInstagram} className="button">
                <Camera size={18} />
                Copiar pedido y abrir Instagram
              </button>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
