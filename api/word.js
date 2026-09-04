// Vercel Serverless Function: 오늘의 영어 단어 프록시
// random-word-api + dictionaryapi 호출을 서버에서 대신 처리 (CORS 우회)

const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36' }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    // 랜덤 단어는 사전에 없는 경우가 많아 최대 5번 재시도
    for (let i = 0; i < 5; i++) {
      const wordRes = await fetch('https://random-word-api.herokuapp.com/word?number=1', { headers: UA })
      if (!wordRes.ok) continue
      const [randomWord] = await wordRes.json()
      const dictRes = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`,
        { headers: UA }
      )
      if (dictRes.ok) {
        const [entry] = await dictRes.json()
        return res.status(200).json({ word: entry })
      }
    }
    return res.status(502).json({ error: '단어 조회 실패, 다시 시도해주세요.' })
  } catch (e) {
    return res.status(502).json({ error: '단어 API 호출 실패' })
  }
}
