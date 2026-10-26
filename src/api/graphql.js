const ENDPOINT = 'https://graphql.pokeapi.co/v1beta2'

// PokeAPI GraphQL에 쿼리를 보내고 data 부분만 돌려준다.
// 네트워크 오류, HTTP 오류, GraphQL 오류는 모두 Error로 던진다.
export async function gql(query, variables = {}) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    throw new Error(`PokeAPI 요청 실패 (HTTP ${response.status})`)
  }

  const json = await response.json()
  if (json.errors) {
    throw new Error(json.errors[0].message)
  }
  return json.data
}
