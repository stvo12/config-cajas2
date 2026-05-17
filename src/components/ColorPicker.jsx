export default function ColorPicker({ title, subtitle, colors, value, onChange, colorName }) {
  return (
    <section className="pickerBlock">
      <div className="pickerTitle">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <strong>{colorName(value)}</strong>
      </div>

      <div className="colorGrid">
        {colors.map((color) => (
          <button
            key={color.value}
            type="button"
            className={value === color.value ? "colorCard selected" : "colorCard"}
            onClick={() => onChange(color.value)}
          >
            <span className="colorPreview" style={{ backgroundColor: color.value }} />
            <span>{color.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}