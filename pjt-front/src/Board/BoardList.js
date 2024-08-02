import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/BoardList.css';
import boardImage from '../assets/images/Board.jpg';

export default function BoardList({ isLoggedIn }) {
  const [datas, setDatas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [likes, setLikes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/board')
      .then(res => {
        console.log('API Response:', res.data);
        res && res.data && setDatas(res.data);
        // Load likes from localStorage
        const savedLikes = JSON.parse(localStorage.getItem('likes')) || {};
        setLikes(savedLikes);
      })
      .catch(err => console.log(err));
  }, []);

  const filteredDatas = datas.filter(board =>
    searchType === 'title'
      ? board.title.toLowerCase().includes(searchTerm.toLowerCase())
      : board.creatorId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWriteClick = () => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    } else {
      navigate('/write');
    }
  };

  return (
    <div className="board-list-container">
      <div className="board-header">
        <h1>게시판 목록</h1>
        <div className="board-actions">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="search-type"
          >
            <option value="title">제목</option>
            <option value="author">작성자</option>
          </select>
          <input
            type="text"
            placeholder={searchType === 'title' ? "게시물 검색..." : "작성자 검색..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={handleWriteClick} className="btn-write">글쓰기</button>
        </div>
      </div>
      <div className="board-grid">
        {filteredDatas.length !== 0 && filteredDatas.map(board => (
          <div className="board-card" key={board.boardIdx}>
            <img 
              src={board.fileInfoList && board.fileInfoList.length > 0 
                ? `http://localhost:8080/api/board/file/${board.boardIdx}/${board.fileInfoList[0].idx}` 
                : boardImage}
              className="board-card-img"
            />
            <div className="board-card-content">
              <h2>
                <Link to={`/detail/${board.boardIdx}`}>{board.title}</Link>
              </h2>
              <p className="author">작성자: {board.creatorId}</p>
              <p className="date">작성일: {new Date(board.createdDatetime).toLocaleDateString()}</p>
              <p className="views">조회수: {board.hitCnt}</p>
              <p className="likes">좋아요: {likes[board.boardIdx] || 0}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}