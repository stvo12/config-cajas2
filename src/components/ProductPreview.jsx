import baseImg from "../assets/base-neutral.png";
import bodyMask from "../assets/body-mask.png";
import secondaryMask from "../assets/secondary-mask.png";
import highlightsImg from "../assets/highlights.png";

export default function ProductPreview({ mainColor, secondaryColor }) {
  return (
    <div className="productMockup">
      <div
        className="paintLayer"
        style={{
          backgroundColor: mainColor,
          WebkitMaskImage: `url(${bodyMask})`,
          maskImage: `url(${bodyMask})`,
        }}
      />

      <div
        className="paintLayer secondaryPaint"
        style={{
          backgroundColor: secondaryColor,
          WebkitMaskImage: `url(${secondaryMask})`,
          maskImage: `url(${secondaryMask})`,
        }}
      />

      <img src={baseImg} className="textureLayer" alt="" />
      <img src={highlightsImg} className="mockupOverlay highlightsLayer" alt="" />
    </div>
  );
}