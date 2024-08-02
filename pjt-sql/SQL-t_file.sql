create table t_file (
	idx 	int(10) unsigned not null auto_increment comment '일련번호', 
    board_idx int(10) unsigned not null comment '게시글 번호', 
    original_file_name varchar(255) not null comment '원본 파일 이름', 
    stored_file_path varchar(500) not null comment '파일 저장 경로', 
    file_size int(15) unsigned not null comment '파일 크기', 
    creator_id varchar(50) not null comment '작성자 아이디', 
    created_datetime datetime not null comment '작성시간', 
    updator_id varchar(50) default null comment '수정자 아이디', 
    updated_datetime datetime default null comment '수정시간',
    deleted_yn char(1) not null default 'N' comment '삭제 여부', 
    primary key (idx));