import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/BoardPreview.css';

export default function BoardPreview() {
    const [image, setImage] = useState(null);
    const { boardIdx, fileIdx } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:8080/api/board/${boardIdx}`)
            .then(res => {
                if (res && res.data && res.data.fileInfoList) {
                    const selectedFile = res.data.fileInfoList.find(file => file.idx == fileIdx);
                    if (selectedFile) {
                        setImage(selectedFile);
                    }
                }
            })
            .catch(err => console.error("Error fetching image details:", err));
    }, [boardIdx, fileIdx]);

    return (
        <div className="preview-container">
            <div className="preview-images">
                {image && (
                    <div className="image-wrapper">
                        <img
                            src={`http://localhost:8080/api/board/file/${boardIdx}/${fileIdx}`}
                            className="preview-image"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}