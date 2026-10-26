# 01. 컴포넌트와 props

## 이번 단계에서 한 일

샘플 포켓몬 3마리를 카드로 보여 주는 화면을 만들었다. 화면을 네 개의 **컴포넌트**로 나눴다.

```
App
├─ Header            빨간 상단 바
└─ PokemonGrid       카드를 격자로 늘어놓음
   └─ PokemonCard    (× 3) 카드 한 장
      └─ TypeBadge   (× 타입 수) 타입 배지
```

## 개념 1: 컴포넌트

**컴포넌트는 화면 조각을 돌려주는 함수**다. 이름은 대문자로 시작한다.

```jsx
function TypeBadge({ type }) {
  const { ko, color } = TYPES[type]
  return (
    <span className="type-badge" style={{ background: color }}>
      {ko}
    </span>
  )
}
```

다른 곳에서는 HTML 태그처럼 `<TypeBadge type="fire" />`로 쓴다. 한 번 만들어 두면 카드에서도, 나중에 상세 페이지에서도 똑같이 다시 쓸 수 있다.

## 개념 2: JSX

`return` 안의 HTML 비슷한 문법이 **JSX**다. HTML과 다른 점이 몇 가지 있다.

| HTML | JSX | 이유 |
|---|---|---|
| `class="..."` | `className="..."` | `class`는 JavaScript 예약어라서 |
| `style="background: red"` | `style={{ background: 'red' }}` | 스타일을 객체로 넘긴다. 바깥 `{}`는 "JS 값", 안쪽 `{}`는 객체 |
| 값 넣기 불가 | `{pokemon.name}` | 중괄호 안에는 JavaScript 식을 쓸 수 있다 |

## 개념 3: props (부모가 자식에게 주는 값)

```jsx
<PokemonCard pokemon={pokemon} />        // 부모(PokemonGrid)가 넘김

function PokemonCard({ pokemon }) { ... } // 자식이 받음
```

- 태그에 붙인 속성은 하나의 객체(`props`)로 묶여서 함수의 첫 번째 인자로 들어온다.
- `{ pokemon }`은 구조 분해 문법이다. `props.pokemon`을 바로 꺼내 쓴다.
- props는 **읽기 전용**이다. 자식이 바꾸면 안 된다.

### 특별한 prop: `children`

```jsx
function Header({ children }) {
  return (
    <header className="header">
      <div className="header__logo">포켓몬 도감</div>
      {children}
    </header>
  )
}
```

`<Header>여기 들어간 내용</Header>`처럼 태그 사이에 넣은 것이 `children`으로 들어온다. 다음 단계에서 검색창을 이 자리에 넣는다.

## 개념 4: 배열을 화면으로 — `map`과 `key`

```jsx
{pokemonList.map((pokemon) => (
  <PokemonCard key={pokemon.id} pokemon={pokemon} />
))}
```

- `map`은 배열의 각 항목을 컴포넌트로 바꾼 새 배열을 만든다. React는 그 배열을 순서대로 그린다.
- **`key`는 반드시 붙인다.** 목록이 바뀌었을 때 React가 "어느 카드가 어느 포켓몬인지" 구분하는 이름표다. 겹치지 않는 값(여기서는 도감 번호)을 쓴다. 배열 순서 번호(index)는 목록이 필터로 바뀔 때 엉킬 수 있어서 피한다.

## 개념 5: 컴포넌트마다 CSS 파일

`PokemonCard.jsx` 옆에 `PokemonCard.css`를 두고 `import './PokemonCard.css'`로 불러온다. 클래스 이름은 `pokemon-card__name`처럼 컴포넌트 이름을 앞에 붙였다. CSS는 앱 전체에 적용되기 때문에 다른 컴포넌트와 이름이 겹치지 않게 하기 위해서다.

## 데이터와 화면 분리

타입의 한국어 이름과 색은 `src/data/types.js`에 따로 모았다.

```js
export const TYPES = {
  fire: { ko: '불꽃', color: '#ee8130' },
  ...
}
```

PokeAPI는 타입을 `'fire'`처럼 영어로 준다. 화면에서는 `TYPES[type].ko`로 한국어를 꺼낸다. 데이터가 한곳에 있으니 색을 바꾸고 싶으면 이 파일만 고치면 된다.

## 연습 거리

1. `App.jsx`의 `samplePokemon`에 피카츄 `{ id: 25, name: '피카츄', generation: 1, types: ['electric'] }`를 추가해 보자.
2. `TypeBadge.css`에서 `border-radius`를 `999px`로 바꿔 알약 모양 배지를 만들어 보자.
3. `PokemonGrid.jsx`에서 `key={pokemon.id}`를 지우면 브라우저 개발자 도구(F12) 콘솔에 어떤 경고가 나오는지 확인해 보자. 확인했으면 원래대로 돌려놓는다.
