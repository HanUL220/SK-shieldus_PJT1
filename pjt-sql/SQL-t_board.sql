create table t_board (
       board_idx         int(11)      not null auto_increment comment '글 번호', 
       title             varchar(300) not null                comment '제목',
       contents          text         not null                comment '내용', 
       hit_cnt           smallint(10) not null default '0'    comment '조회수', 
       created_datetime  datetime     not null                comment '작성시간', 
       creator_id        varchar(50)  not null                comment '작성자', 
       updated_datetime  datetime     null                    comment '수정시간', 
       updator_id        varchar(50)  null                    comment '수정자', 
       deleted_yn        char(1)      not null default 'N'    comment '삭제여부', 
       primary key (board_idx)
);