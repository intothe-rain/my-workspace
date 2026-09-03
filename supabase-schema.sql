-- My Workspace 테이블 생성 SQL
-- Supabase > SQL Editor에 붙여넣고 Run 하세요

-- 1. 북마크
create table if not exists bookmarks (
  id bigint generated always as identity primary key,
  name text not null,
  url text not null,
  category text default '기타',
  color text default '#6366f1',
  created_at timestamptz default now()
);

-- 2. 메모
create table if not exists notes (
  id bigint generated always as identity primary key,
  title text not null,
  content text default '',
  color text default '#6366f1',
  pinned boolean default false,
  created_at timestamptz default now()
);

-- 3. 할 일
create table if not exists todos (
  id bigint generated always as identity primary key,
  text text not null,
  completed boolean default false,
  priority text default 'medium',
  due_date text default '오늘',
  created_at timestamptz default now()
);

-- 읽기/쓰기 허용 (개인 프로젝트 1단계: 로그인 없이 사용)
-- 나중에 로그인 붙이면 이 부분을 다시 좁힐 예정
alter table bookmarks enable row level security;
alter table notes enable row level security;
alter table todos enable row level security;

create policy "allow all for bookmarks"
  on bookmarks for all using (true) with check (true);

create policy "allow all for notes"
  on notes for all using (true) with check (true);

create policy "allow all for todos"
  on todos for all using (true) with check (true);
