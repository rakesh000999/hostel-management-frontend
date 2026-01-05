import React from "react";
import { getStudentDocumentUrl } from "../api/fileApi";

const StudentDocuments = ({ studentId }) => {
  const photoUrl = getStudentDocumentUrl(studentId, "photo");
  const identityUrl = getStudentDocumentUrl(studentId, "identity");

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Student Documents</h3>

      {/* Student Photo */}
      <div style={{ marginBottom: "20px" }}>
        <h4>Photo</h4>
        <img
          src={photoUrl}
          alt="Student"
          style={{
            width: "150px",
            height: "150px",
            objectFit: "cover",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>

      {/* Identity Document */}
      <div>
        <h4>Identity Document</h4>
        <a
          href={identityUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#2563eb", fontWeight: "bold" }}
        >
          View Identity Document
        </a>
      </div>
    </div>
  );
};

export default StudentDocuments;
