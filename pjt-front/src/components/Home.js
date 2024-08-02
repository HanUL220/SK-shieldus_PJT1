import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1>SHARE YOUR<br />JOURNEY</h1>
      <br />
      <p>여행의 순간을 기록하고 다른 여행자들과 공유하세요.<br />
        주말 여행부터 장기간의 모험까지, 우리 플랫폼을 통해 상세한 일정표를 작성하고
        사진을 업로드하며 유용한 팁을 제공할 수 있습니다.<br />
        탐험가 커뮤니티에 가입하여 당신의 여정을 오늘부터 시작해보세요!</p>

      <Link to="/blog" className="btnGo">Explore Now</Link>
    </div>
  );
};

export default Home;