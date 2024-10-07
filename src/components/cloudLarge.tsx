export default function CloudLarge({
  width = 150,
  height = 90,
  color = "#FFFFFF",
  style = {},
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 96 54"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <g fill={color}>
        <ellipse cx="30" cy="40" rx="15" ry="12" />
        <ellipse cx="45" cy="30" rx="18" ry="15" />
        <ellipse cx="60" cy="40" rx="15" ry="12" />
        <ellipse cx="45" cy="45" rx="20" ry="18" />
      </g>
    </svg>
  );
}
