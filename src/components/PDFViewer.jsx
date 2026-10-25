
import React from "react";

function PDFViewer({ file, title }) {
  return (
    <div className="pdf-viewer" dir="rtl">
      {/* <h3>{title}</h3> */}

      <iframe
        src={file}
        title={title}
        width="100%"
        height="600"
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
        }}
      />

      <a href={file} target="_blank" rel="noreferrer">
        פתיחת הקובץ בחלון חדש
      </a>
    </div>
  );
}

export default PDFViewer;
