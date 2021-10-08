import React, { useState, useEffect } from "react";
import { Avatar } from "antd";

function gen_text_img(size, s) {
  let colors = [
    "rgb(239,150,26)", 'rgb(255,58,201)', "rgb(111,75,255)", "rgb(36,174,34)", "rgb(80,80,80)"
  ];
  let cvs = document.createElement("canvas");
  cvs.setAttribute('width', size);
  cvs.setAttribute('height', size);
  let ctx = cvs.getContext("2d");
  ctx.fillStyle = colors[Math.floor(Math.random() * (colors.length))];
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = 'rgb(255,255,255)';
  ctx.font = size * 0.5 + "px Arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(s, size / 2, size / 2);

  return cvs.toDataURL('image/jpeg', 1);
}


const CategoryAvatar = ({ src, category }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  const onError = () => {
    setError(true);
  };
  const renderSrc =
    error
      ? gen_text_img(32, category[0].toUpperCase())
      : `/images/${category}.png`

  return (
    <Avatar
      onError={onError}
      src={renderSrc}
    />
  );
};
export default CategoryAvatar;