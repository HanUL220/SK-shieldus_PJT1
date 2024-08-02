import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/BoardWrite.css';
import '../styles/BoardCommonStyles.css';

export default function BoardWrite() {
    const [title, setTitle] = useState('');
    const [contents, setContents] = useState('');
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();
    const fileInputRef = useRef();

    const handleTitleChange = e => setTitle(e.target.value);
    const handleContentsChange = e => setContents(e.target.value);

    const handleFileChange = e => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 10) {
            alert('이미지는 최대 10개까지만 업로드 가능합니다.');
            fileInputRef.current.value = '';
            setFiles([]);
        } else {
            setFiles(selectedFiles);
        }
    };

    const handleSubmit = e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify({ title, contents })], { type: 'application/json' }));
        files.forEach(file => formData.append('files', file));

        axios.post('http://localhost:8080/api/board/write', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        })
            .then(res => {
                if (res && res.status === 200) {
                    navigate('/blog');
                }
            })
            .catch(err => console.error("Error submitting form:", err));
    };

    return (
        <div className="container">
            <h1>게시글 작성</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">제목</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="제목을 입력하세요"
                        required // HTML 폼 요소에서 사용되는 속성으로, 특정 입력 필드가 반드시 채워져야 함을 지정
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="contents">내용</label>
                    <textarea
                        id="contents"
                        name="contents"
                        value={contents}
                        onChange={handleContentsChange}
                        placeholder="내용을 입력하세요"
                        required // HTML 폼 요소에서 사용되는 속성으로, 특정 입력 필드가 반드시 채워져야 함을 지정
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="files">파일 첨부 (최대 10개)</label>
                    <input
                        type="file"
                        id="files"
                        name="files"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                        accept=".jpg,.jpeg,.png,.gif,.pdf,.docx,.xlsx"
                    />
                    <div className="file-list">
                        {files.map((file, index) => (
                            <p key={index}>{file.name}</p>
                        ))}
                    </div>
                </div>
                <div className="button-group">
                    <button type="submit" className="btn submit-btn">저장</button>
                    <button type="button" className="btn cancel-btn" onClick={() => navigate('/blog')}>취소</button>
                </div>
            </form>
        </div>
    );
}