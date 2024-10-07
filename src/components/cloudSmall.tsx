export default function CloudSmall({
  width = 80,
  height = 48,
  color = "#FFFFFF",
  style = {},
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 27"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <g fill={color}>
        <ellipse cx="12" cy="16" rx="6" ry="4" />
        <ellipse cx="24" cy="12" rx="8" ry="6" />
        <ellipse cx="36" cy="16" rx="6" ry="4" />
        <ellipse cx="24" cy="19" rx="10" ry="9" />
      </g>
    </svg>
  );
}
