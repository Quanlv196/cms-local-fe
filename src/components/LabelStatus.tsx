// src/components/StatusLabel.tsx
import React from "react";

export const getLabelStatus = (status: number) => {
  switch (status) {
    case 0:
      return <span className="label__status warning">Ngưng</span>;
    case 1:
      return <span className="label__status success">Hoạt động</span>;
    default:
      return "---";
  }
};
