import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import '../styles/BoardDetail.css';

export default function BoardDetail({ username }) {
    const [board, setBoard] = useState({});
    const [title, setTitle] = useState('');
    const [contents, setContents] = useState('');
    const [likes, setLikes] = useState({});
    const [userLikes, setUserLikes] = useState({});
    const [showAttachments, setShowAttachments] = useState(false);
    const { boardIdx } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8080/api/board/${boardIdx}`)
            .then(res => {
                if (res && res.data) {
                    setBoard(res.data);
                    setTitle(res.data.title);
                    setContents(res.data.contents);
                }
            })
            .catch(err => console.error("Error fetching board details:", err));

        // Load likes and userLikes from localStorage
        const savedLikes = JSON.parse(localStorage.getItem('likes')) || {};
        const savedUserLikes = JSON.parse(localStorage.getItem('userLikes')) || {};
        setLikes(savedLikes);
        setUserLikes(savedUserLikes);
    }, [boardIdx]);

    const handleAction = (action) => {
        switch (action) {
            case 'list':
                navigate('/blog');
                break;
            case 'update':
                axios.put(`http://localhost:8080/api/board/${boardIdx}`, { title, contents })
                    .then(res => {
                        if (res && res.status === 200) navigate('/blog');
                    })
                    .catch(err => console.error("Error updating board:", err));
                break;
            case 'delete':
                if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
                    axios.delete(`http://localhost:8080/api/board/${boardIdx}`)
                        .then(res => {
                            if (res && res.status === 200) navigate('/blog');
                        })
                        .catch(err => console.error("Error deleting board:", err));
                }
                break;
            default:
                break;
        }
    };

    const handleDownload = (fileInfo) => {
        const { boardIdx, idx, originalFileName } = fileInfo;
        axios({
            url: `http://localhost:8080/api/board/file/${boardIdx}/${idx}`,
            method: 'GET',
            responseType: 'blob'
        })
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', originalFileName);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            })
            .catch(err => console.error("Error downloading file:", err));
    };

    const isCreator = board.creatorId === username;

    const handleLikeClick = () => {
        if (!username) {
            alert('로그인이 필요합니다.');
            return;
        }
        const hasLiked = userLikes[username] && userLikes[username].includes(boardIdx);

        setLikes(prevLikes => {
            const updatedLikes = { ...prevLikes, [boardIdx]: hasLiked ? (prevLikes[boardIdx] || 1) - 1 : (prevLikes[boardIdx] || 0) + 1 };
            localStorage.setItem('likes', JSON.stringify(updatedLikes));
            return updatedLikes;
        });

        setUserLikes(prevUserLikes => {
            const userLikeList = prevUserLikes[username] ? [...prevUserLikes[username]] : [];
            if (hasLiked) {
                const index = userLikeList.indexOf(boardIdx);
                if (index > -1) userLikeList.splice(index, 1);
            } else {
                userLikeList.push(boardIdx);
            }
            const updatedUserLikes = { ...prevUserLikes, [username]: userLikeList };
            localStorage.setItem('userLikes', JSON.stringify(updatedUserLikes));
            return updatedUserLikes;
        });
    };

    return (
        <div className="blog-container">
            <div className="blog-header">
                {isCreator ? (
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="blog-title-input"
                    />
                ) : (
                    <h1 className="blog-title">{title}</h1>
                )}
                <div className="blog-info">
                    <span>작성자: {board.creatorId}</span>
                    <span>작성일: {board.createdDatetime}</span>
                    <span>조회수: {board.hitCnt}</span>
                    <div className="like-section">
                        <button
                            className={`like-button ${userLikes[username] && userLikes[username].includes(boardIdx) ? 'liked' : ''}`}
                            onClick={handleLikeClick}
                            disabled={!username}
                        >
                            <span className="like-icon">❤️</span>
                            <span className="like-count">{likes[boardIdx] || 0}</span>
                        </button>
                    </div>
                    <div className="attachment-dropdown">
                        <button onClick={() => setShowAttachments(!showAttachments)}>
                            첨부파일 {showAttachments ? '▲' : '▼'}
                        </button>
                        {showAttachments && (
                            <ul className="attachment-list">
                                {board.fileInfoList && board.fileInfoList.length > 0 ? (
                                    board.fileInfoList.map(fileInfo => (
                                        <li key={fileInfo.idx} onClick={() => handleDownload(fileInfo)}>
                                            {fileInfo.originalFileName}
                                        </li>
                                    ))
                                ) : (
                                    <li>첨부파일 없음</li>
                                )}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
            {isCreator ? (
                <textarea
                    value={contents}
                    onChange={(e) => setContents(e.target.value)}
                    className="blog-content-textarea"
                />
            ) : (
                <div className="blog-content-readonly">{contents}</div>
            )}
            <div className="attached-images">
                {board.fileInfoList && board.fileInfoList.map(fileInfo => (
                    <div key={fileInfo.idx} className="attached-image-item">
                        <img
                            src={`http://localhost:8080/api/board/file/${fileInfo.boardIdx}/${fileInfo.idx}`}
                            alt={fileInfo.originalFileName}
                            onClick={() => window.open(`/preview/${boardIdx}/${fileInfo.idx}`, '_blank')}
                        />
                        <span>{fileInfo.originalFileName}</span>
                    </div>
                ))}
            </div>
            <div className="blog-actions">
                <button onClick={() => handleAction('list')}>목록</button>
                {isCreator && (
                    <>
                        <button onClick={() => handleAction('update')}>수정</button>
                        <button onClick={() => handleAction('delete')}>삭제</button>
                    </>
                )}
            </div>
        </div>
    );
}