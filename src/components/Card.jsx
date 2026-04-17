import React from "react";

function Card({
  title = "Title",
  description = "Description",
  border = "border-gray-300",
  color = "text-gray-500",
  icon,
  ...props
}) {
  const iconElement =
    typeof icon === "function"
      ? React.createElement(icon, {
          className: `text-5xl mx-auto mb-4 ${color}`,
        })
      : null;

  return (
    <div
      className={`bg-white p-8 rounded-lg shadow-md text-center border-t-4 ${border} hover:shadow-lg transition duration-300 ease-in-out`}
      {...props}
    >
      {iconElement}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default Card;
