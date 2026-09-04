// Vercel Serverless Function: 고속도로 교통량 프록시
// 브라우저 직접 호출 시 CORS 차단되므로 서버에서 대신 호출
// 인증키는 서버 환경변수(EX_API_KEY)에만 보관

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const key = process.env.EX_API_KEY
  if (!key) {
    return res.status(500).json({ code: 'ERROR', message: 'API 키 미설정 (EX_API_KEY)' })
  }

  const { tmType = '1', exDivCode = '', tcsType = '', carType = '' } = req.query || {}
  const params = new URLSearchParams({ key, type: 'json', tmType })
  if (exDivCode) params.set('exDivCode', exDivCode)
  if (tcsType) params.set('tcsType', tcsType)
  if (carType) params.set('carType', carType)

  try {
    const r = await fetch(`https://data.ex.co.kr/openapi/trafficapi/trafficAll?${params}`)
    const data = await r.json()
    return res.status(200).json(data)
  } catch (e) {
    return res.status(502).json({ code: 'ERROR', message: '교통량 API 호출 실패' })
  }
}
