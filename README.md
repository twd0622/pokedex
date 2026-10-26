# 포켓몬 도감

React를 배우면서 만든 개인용 포켓몬 도감이다. 1~9세대 1,025종을 한국어로 보여 준다.

- 이름·번호 검색, 세대·타입 필터
- 상세 페이지: 기본 정보, 배틀(능력치·특성·타입 상성), 진화·모습 바꾸기, 버전별 배우는 기술, 세부 데이터와 출현 장소

## 실행

Node.js LTS가 필요하다.

```bash
npm install     # 처음 한 번
npm run dev     # 개발 서버 → http://localhost:5173
npm test        # 테스트 (Vitest)
npm run build   # 배포용 파일을 dist/에 만든다
npm run lint    # 코드 검사 (oxlint)
```

## 데이터

모든 데이터는 [PokeAPI](https://pokeapi.co/)의 GraphQL 엔드포인트(`https://graphql.pokeapi.co/v1beta2`)에서 가져온다. 이미지는 PokeAPI sprites 저장소의 공식 일러스트다. 포켓몬 목록은 브라우저 localStorage(`pokedex:list:v1`)에 저장해 두고 다시 쓴다.

## 코드 구조

```
src/
  api/         PokeAPI 요청 (GraphQL 쿼리)
  lib/         API 응답 → 화면용 데이터로 바꾸는 순수 함수 (테스트 대상)
  data/        한국어 이름·색 등 고정 데이터 (타입, 세대, 상성표, 라벨)
  hooks/       usePokemonList, useAsync
  components/  카드, 사이드바, 상세 탭 등 화면 부품
  pages/       ListPage, DetailPage, NotFound
```

## 학습 노트

단계별로 무엇을 만들었고 어떤 React 개념을 배웠는지 `docs/learning/`에 정리했다.

| # | 노트 | 주제 |
|---|---|---|
| 00 | [개발환경](docs/learning/00-개발환경.md) | Node.js, Vite, 프로젝트 구조 |
| 01 | [컴포넌트와 props](docs/learning/01-컴포넌트와-props.md) | 컴포넌트, JSX, props, map과 key |
| 02 | [데이터 불러오기](docs/learning/02-데이터-불러오기.md) | useState, useEffect, 커스텀 훅 |
| 03 | [검색과 필터](docs/learning/03-검색과-필터.md) | 제어 컴포넌트, 상태 끌어올리기, useMemo |
| 04 | [라우팅과 상세 페이지](docs/learning/04-라우팅과-상세-페이지.md) | React Router, 주소에 상태 두기, useAsync |
| 05 | [탭과 조건부 렌더링](docs/learning/05-탭과-조건부-렌더링.md) | 조건부 렌더링, 계산 로직 분리 |
| 06 | [진화와 모습](docs/learning/06-진화와-모습.md) | 상태 공유, 트리 데이터, Fragment |
| 07 | [기술 목록](docs/learning/07-기술-목록.md) | 필요할 때 불러오기, select, 기본값 계산 |
| 08 | [세부 데이터](docs/learning/08-세부-데이터.md) | 데이터 묶기, 대체 문구 |
| 09 | [돌아보기](docs/learning/09-돌아보기.md) | 전체 구조와 다음 단계 |

설계와 구현 계획은 `docs/superpowers/`에 있다.
