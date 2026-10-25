
import React from "react";
import "../styles/interactive-image.css";
import { assetUrl } from "../utils/assetUrl";

export default function InteractiveImage({ image }) {
  if (!image?.src) {
    return null;
  }

  const hotspots = image.hotspots || [];

  return (
    <div className="interactive-diagram" dir="rtl">
      <div className="interactive-diagram-stage">
        <img
          src={assetUrl(image.src)}
          alt={image.alt || "Interactive diagram"}
          className="interactive-diagram-img"
          loading="lazy"
        />

        {hotspots.map((hotspot, index) => {
          const id = hotspot.id ?? index;
          const x = Number(hotspot.x);
          const y = Number(hotspot.y);

          if (
            !Number.isFinite(x) ||
            !Number.isFinite(y)
          ) {
            return null;
          }

          const title =
            hotspot.title ||
            hotspot.label ||
            `מבנה ${index + 1}`;

          const explanation =
            hotspot.explanation ||
            hotspot.description ||
            hotspot.text ||
            "";

          return (
            <div
              key={id}
              className="interactive-diagram-point"
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
            >
              <button
                type="button"
                className="interactive-diagram-marker"
                aria-label={title}
                aria-describedby={`hotspot-${id}`}
              >
                {index + 1}
              </button>

              <div
                id={`hotspot-${id}`}
                className={`interactive-diagram-tooltip ${
                  x > 55 ? "open-left" : "open-right"
                }`}
                role="tooltip"
              >
                <strong>{title}</strong>
                {explanation && <p>{explanation}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
