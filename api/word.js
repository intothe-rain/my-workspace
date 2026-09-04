// Vercel Serverless Function: 오늘의 영어 단어
// 내장 단어장 우선 (즉시 응답), Free Dictionary API로 상세 보강 시도 (4초 타임아웃)

const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36' }

const WORDS = [
  { w: 'serendipity', pos: 'noun', def: 'Finding something good by chance when you were not looking for it.', ex: 'Meeting my best friend was pure serendipity.' },
  { w: 'ephemeral', pos: 'adjective', def: 'Lasting for a very short time.', ex: 'The beauty of cherry blossoms is ephemeral.' },
  { w: 'resilient', pos: 'adjective', def: 'Able to recover quickly from difficulties.', ex: 'Children are often remarkably resilient.' },
  { w: 'meticulous', pos: 'adjective', def: 'Very careful and precise about details.', ex: 'She kept meticulous records of every expense.' },
  { w: 'pragmatic', pos: 'adjective', def: 'Dealing with problems in a practical way.', ex: 'We need a pragmatic approach to save costs.' },
  { w: 'eloquent', pos: 'adjective', def: 'Able to express ideas clearly and powerfully.', ex: 'His eloquent speech moved the audience.' },
  { w: 'tranquil', pos: 'adjective', def: 'Calm, quiet, and peaceful.', ex: 'We spent a tranquil weekend in the countryside.' },
  { w: 'diligent', pos: 'adjective', def: 'Working hard and carefully.', ex: 'Diligent practice is the key to improvement.' },
  { w: 'insight', pos: 'noun', def: 'A deep and clear understanding of something.', ex: 'The book gave me new insights into history.' },
  { w: 'humble', pos: 'adjective', def: 'Not thinking you are better than others; modest.', ex: 'Stay humble even after you succeed.' },
  { w: 'grateful', pos: 'adjective', def: 'Feeling thankful for something.', ex: 'I am grateful for your help.' },
  { w: 'curiosity', pos: 'noun', def: 'A strong desire to know or learn something.', ex: 'Curiosity drives every great discovery.' },
  { w: 'courage', pos: 'noun', def: 'The ability to face fear or difficulty.', ex: 'It takes courage to admit mistakes.' },
  { w: 'wisdom', pos: 'noun', def: 'The ability to make good decisions from experience.', ex: 'With age often comes wisdom.' },
  { w: 'journey', pos: 'noun', def: 'Travel from one place to another; also a process of growth.', ex: 'Learning English is a long journey.' },
  { w: 'harbor', pos: 'noun', def: 'A safe place where ships stay; a place of safety.', ex: 'The harbor was full of fishing boats.' },
  { w: 'lantern', pos: 'noun', def: 'A lamp with a cover, often carried by hand.', ex: 'They lit lanterns for the festival.' },
  { w: 'meadow', pos: 'noun', def: 'A field of grass and flowers.', ex: 'Cows grazed in the green meadow.' },
  { w: 'thunder', pos: 'noun', def: 'The loud sound after lightning in a storm.', ex: 'Thunder woke me up last night.' },
  { w: 'blossom', pos: 'verb', def: 'To produce flowers; to grow and develop well.', ex: 'Her confidence blossomed at the new job.' },
  { w: 'whisper', pos: 'verb', def: 'To speak very quietly.', ex: 'She whispered the secret to me.' },
  { w: 'glow', pos: 'verb', def: 'To shine with a soft, warm light.', ex: 'The campfire glowed in the dark.' },
  { w: 'mist', pos: 'noun', def: 'Thin fog close to the ground.', ex: 'Morning mist covered the lake.' },
  { w: 'resonate', pos: 'verb', def: 'To create a deep feeling of agreement or memory.', ex: 'Her story resonated with many listeners.' },
  { w: 'thrive', pos: 'verb', def: 'To grow well and be successful.', ex: 'Plants thrive with enough sunlight.' },
  { w: 'flourish', pos: 'verb', def: 'To grow strongly and be successful.', ex: 'Small businesses flourish in this town.' },
  { w: 'nurture', pos: 'verb', def: 'To care for and help something grow.', ex: 'Parents nurture their children with love.' },
  { w: 'embrace', pos: 'verb', def: 'To hug; to accept something gladly.', ex: 'Embrace new challenges with confidence.' },
  { w: 'cherish', pos: 'verb', def: 'To love and care for something deeply.', ex: 'I cherish every moment with my family.' },
  { w: 'adventure', pos: 'noun', def: 'An exciting or unusual experience.', ex: 'Our trip became a great adventure.' },
  { w: 'discover', pos: 'verb', def: 'To find something for the first time.', ex: 'Scientists discovered a new planet.' },
  { w: 'explore', pos: 'verb', def: 'To travel through a place to learn about it.', ex: 'We explored the old city on foot.' },
  { w: 'imagine', pos: 'verb', def: 'To picture something in your mind.', ex: 'Imagine a world without war.' },
  { w: 'believe', pos: 'verb', def: 'To think something is true; to trust.', ex: 'I believe you can do it.' },
  { w: 'achieve', pos: 'verb', def: 'To reach a goal by effort.', ex: 'She achieved her dream of becoming a doctor.' },
  { w: 'persist', pos: 'verb', def: 'To keep going despite difficulties.', ex: 'If you persist, you will succeed.' },
  { w: 'endeavor', pos: 'verb', def: 'To try hard to do something.', ex: 'We endeavor to serve you better.' },
  { w: 'luminous', pos: 'adjective', def: 'Shining brightly, full of light.', ex: 'The luminous moon lit the path.' },
  { w: 'serene', pos: 'adjective', def: 'Calm and peaceful.', ex: 'She has a serene smile.' },
  { w: 'radiant', pos: 'adjective', def: 'Shining brightly; full of joy.', ex: 'The bride looked radiant.' },
  { w: 'gentle', pos: 'adjective', def: 'Kind, soft, and not rough.', ex: 'Be gentle with the baby.' },
  { w: 'profound', pos: 'adjective', def: 'Very deep in meaning or feeling.', ex: 'His words had a profound effect on me.' },
  { w: 'subtle', pos: 'adjective', def: 'Small and hard to notice.', ex: 'There is a subtle difference in taste.' },
  { w: 'keen', pos: 'adjective', def: 'Very interested; sharp and quick.', ex: 'She has a keen interest in music.' },
  { w: 'astute', pos: 'adjective', def: 'Smart at understanding situations quickly.', ex: 'An astute investor saw the chance early.' },
  { w: 'persevere', pos: 'verb', def: 'To continue trying despite hardship.', ex: 'Persevere and your efforts will pay off.' },
  { w: 'harmony', pos: 'noun', def: 'A peaceful state where parts fit well together.', ex: 'They live in harmony with nature.' },
  { w: 'gratitude', pos: 'noun', def: 'The feeling of being thankful.', ex: 'Express gratitude to those who help you.' },
  { w: 'beacon', pos: 'noun', def: 'A light that guides; a source of hope.', ex: 'The lighthouse served as a beacon for ships.' },
  { w: 'voyage', pos: 'noun', def: 'A long journey by sea or in space.', ex: 'They set sail on a voyage across the ocean.' },
  { w: 'summit', pos: 'noun', def: 'The top of a mountain; the highest point.', ex: 'We reached the summit at sunrise.' },
]

function toEntry(e) {
  return {
    word: e.w,
    phonetic: '',
    phonetics: [],
    meanings: [{ partOfSpeech: e.pos, definitions: [{ definition: e.def, example: e.ex }] }],
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const picked = WORDS[Math.floor(Math.random() * WORDS.length)]

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 4000)
    const r = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${picked.w}`,
      { headers: UA, signal: controller.signal }
    )
    clearTimeout(timer)
    if (r.ok) {
      const [entry] = await r.json()
      if (entry) return res.status(200).json({ word: entry, live: true })
    }
  } catch (e) {
    // API 실패 시 내장 단어장으로 폴백
  }
  return res.status(200).json({ word: toEntry(picked), live: false })
}
