export default function Cloud({
  width = 100,
  height = 60,
  color = "#FFFFFF",
  style = {},
}) {
  return (
    <div style={{ position: "relative", ...style }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill={color}>
          <ellipse cx="20" cy="30" rx="10" ry="8" />
          <ellipse cx="30" cy="25" rx="12" ry="10" />
          <ellipse cx="40" cy="30" rx="10" ry="8" />
          <ellipse cx="30" cy="35" rx="14" ry="12" />
        </g>
      </svg>
    </div>
  );
}
