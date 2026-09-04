// Vercel Serverless Function: 오늘의 영어 단어
// 단어 목록은 내장, 뜻/발음은 Free Dictionary API에서 조회 (CORS 우회)

const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36' }

const WORDS = [
  'serendipity', 'ephemeral', 'resilient', 'meticulous', 'pragmatic',
  'eloquent', 'vivid', 'tranquil', 'diligent', 'insight',
  'curious', 'brave', 'honest', 'patient', 'humble',
  'grateful', 'curiosity', 'wonder', 'courage', 'wisdom',
  'journey', 'harbor', 'lantern', 'meadow', 'ocean',
  'thunder', 'blossom', 'whisper', 'glow', 'mist',
  'resonate', 'thrive', 'flourish', 'nurture', 'embrace',
  'cherish', 'adventure', 'discover', 'explore', 'create',
  'imagine', 'believe', 'achieve', 'persist', 'endeavor',
  'luminous', 'serene', 'radiant', 'gentle', 'vivid',
  'profound', 'subtle', 'keen', 'astute', 'sturdy',
  'diligence', 'persevere', 'tranquility', 'harmony', 'gratitude',
  'compass', 'anchor', 'beacon', 'voyage', 'summit',
]

function pickRandom(arr, n) {
  const copy = [...arr]
  const out = []
  while (out.length < n && copy.length) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0])
  }
  return out
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const candidates = pickRandom(WORDS, 3)
    const results = await Promise.allSettled(
      candidates.map((w) =>
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${w}`, { headers: UA }).then((r) => {
          if (!r.ok) throw new Error('not found')
          return r.json()
        })
      )
    )
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value?.[0]) {
        return res.status(200).json({ word: r.value[0] })
      }
    }
    return res.status(502).json({ error: '단어 조회 실패, 다시 시도해주세요.' })
  } catch (e) {
    return res.status(502).json({ error: '단어 API 호출 실패' })
  }
}
