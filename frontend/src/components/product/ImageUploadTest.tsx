import axios from "axios";
import { useState } from "react";

const ImageUploadTest = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('Select a file first');

    const formData = new FormData();
    formData.append('image', file);

    await axios.post(
      'http://localhost:3000/api/admin/products/upload',
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    alert('Upload success');
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleChange} className="border" />
      <button onClick={handleUpload} className="border">Upload</button>
    </div>
  );
}

export default ImageUploadTest
