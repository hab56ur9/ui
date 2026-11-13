export type EmojiCategory = "smileys" | "people" | "nature" | "food" | "activity" | "travel" | "objects" | "symbols";

export type Emoji = { emoji: string; ko: string[]; en: string[] };

const SOURCE: Record<EmojiCategory, string> = {
  smileys: `
😀|웃음, 미소, 기쁨|grin, smile, happy
😂|눈물, 웃음, 폭소|joy, laugh, tears
🥹|감동, 울컥|moved, holding, back, tears
😊|미소, 수줍음|blush, smile
😍|하트 눈, 반함|heart eyes, love
🤩|반짝, 감탄|star struck, wow
😎|선글라스, 멋짐|cool, sunglasses
🤔|생각, 고민, 확신 없음|thinking, hmm
🫡|경례, 알겠습니다|salute
😮|놀람, 와|surprised, wow
😅|땀, 멋쩍음|sweat smile
😢|슬픔, 눈물|sad, cry
😭|엉엉, 울음|sob, crying
😡|화남, 분노|angry, rage
😴|졸림, 잠|sleepy, sleep
🤯|충격, 머리 폭발|mind blown`,
  people: `
👍|좋아요, 엄지, 동의, 받음|thumbs up, like, agree
👎|싫어요, 반대, 동의 안 함|thumbs down, dislike, disagree
👏|박수, 칭찬|clap, applause
🙌|만세, 고마움, 결과 좋음|raised hands, hooray, thanks
🙏|부탁, 감사, 기도|pray, please, thanks
👀|눈, 확인 중, 보는 중|eyes, look, watching
💪|힘, 근육, 화이팅|muscle, strong
🤝|악수, 합의|handshake, deal
👋|안녕, 손, 인사|wave, hello, bye
✌️|브이, 평화|victory, peace
👌|오케이, 좋음|ok hand
🫶|하트 손, 사랑|heart hands
🤞|행운, 기원|fingers crossed, luck
☝️|하나, 손가락, 위|point up, one
🧠|뇌, 생각|brain, idea
🙋|손 들기, 저요|raising hand, me`,
  nature: `
🌱|새싹, 시작|seedling, sprout
🌳|나무|tree
🌸|벚꽃, 꽃|cherry blossom, flower
🌻|해바라기|sunflower
🍀|네잎클로버, 행운|clover, luck
🔥|불, 대박, 핫|fire, hot, lit
⚡|번개, 빠름|lightning, fast, zap
🌈|무지개|rainbow
☀️|해, 맑음|sun, sunny
🌧️|비|rain
❄️|눈, 겨울, 얼음|snow, cold
🌊|파도, 바다|wave, ocean
🐶|강아지, 개|dog, puppy
🐱|고양이|cat
🐝|벌, 꿀벌|bee
🦄|유니콘|unicorn`,
  food: `
☕|커피|coffee
🍵|차|tea
🍺|맥주|beer
🍕|피자|pizza
🍔|햄버거|burger
🍜|라면, 국수|noodles, ramen
🍣|초밥|sushi
🍩|도넛|donut
🍰|케이크|cake
🍎|사과|apple
🍓|딸기|strawberry
🍌|바나나|banana
🍿|팝콘|popcorn
🥐|크루아상, 빵|croissant, bread
🌶️|고추, 매움|pepper, spicy
🍫|초콜릿|chocolate`,
  activity: `
🎉|축하, 파티, 폭죽|party, tada, celebrate
🎊|색종이, 축하|confetti
🏆|트로피, 우승|trophy, win
🥇|금메달, 1등|gold medal, first
🎯|과녁, 목표, 정확|target, goal, bullseye
🎮|게임|game
🎨|그림, 디자인|art, design, palette
🎵|음악|music, note
🏃|달리기|run
⚽|축구|soccer
🏀|농구|basketball
🎲|주사위|dice
🧩|퍼즐|puzzle
🎁|선물|gift, present
🎈|풍선|balloon
🪄|마법, 지팡이|magic wand`,
  travel: `
🚀|로켓, 배포, 출시|rocket, launch, ship
✈️|비행기, 여행|airplane, travel
🚗|자동차|car
🚆|기차|train
🚲|자전거|bicycle
🏠|집|house, home
🏢|회사, 빌딩|office, building
🗺️|지도|map
🧭|나침반, 방향|compass
⛰️|산|mountain
🏖️|해변, 휴가|beach, vacation
🌙|달, 밤|moon, night
⭐|별|star
🌍|지구, 세계|earth, world
🛠️|공구, 수리|tools, fix
🚧|공사 중, 작업 중|construction, wip`,
  objects: `
💡|아이디어, 전구|idea, bulb
📌|핀, 고정|pin
📎|클립, 첨부|paperclip, attach
📝|메모, 작성|memo, note, write
📚|책, 문서|books, docs
📈|상승, 차트|chart up, growth
📉|하락, 차트|chart down
🗓️|달력, 일정|calendar, schedule
⏰|알람, 시간|alarm, clock, time
🔔|알림, 종|bell, notify
🔒|잠금, 보안|lock, secure
🔑|열쇠|key
💻|노트북, 컴퓨터|laptop, computer
📱|휴대폰|phone, mobile
🐛|버그, 벌레|bug
🧪|실험, 테스트|test, experiment`,
  symbols: `
✅|완료, 반영, 체크|check, done
❌|실패, 거절, 엑스|cross, fail, no
⚠️|경고, 주의|warning
❗|느낌표, 중요|exclamation, important
❓|물음표, 질문|question
💯|백점, 완벽|hundred, perfect
❤️|하트, 사랑|heart, love, red
💙|파란 하트|blue heart
💚|초록 하트|green heart
✨|반짝, 새것|sparkles, new
🆗|오케이|ok
🆕|새로움|new
➕|더하기, 추가|plus, add
➖|빼기, 제거|minus, remove
🔁|반복, 다시|repeat, again
🔴|빨강 원|red circle`,
};

const CHOSEONG = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";

export const initials = (text: string) => [...text].map((char) => {
  const code = char.charCodeAt(0) - 0xac00;
  return code >= 0 && code <= 11171 ? CHOSEONG[Math.floor(code / 588)] : char.toLowerCase();
}).join("");

const parse = (source: string): Emoji[] =>
  source
    .trim()
    .split("\n")
    .map((line) => {
      const [emoji, ko, en] = line.split("|");
      return { emoji, ko: ko.split(", "), en: en.split(", ") };
    });

export const EMOJI_CATEGORIES = Object.keys(SOURCE) as EmojiCategory[];

export const EMOJI: Record<EmojiCategory, Emoji[]> = Object.fromEntries(EMOJI_CATEGORIES.map((category) => [category, parse(SOURCE[category])])) as Record<EmojiCategory, Emoji[]>;

const ALL = EMOJI_CATEGORIES.flatMap((category) => EMOJI[category]);

const byEmoji = new Map(ALL.map((item) => [item.emoji, item]));

export const emojiOf = (emoji: string): Emoji => byEmoji.get(emoji) ?? { emoji, ko: [], en: [] };

const rank = (item: Emoji, query: string) => {
  const names = [...item.ko, ...item.en].map((name) => name.toLowerCase());
  const words = names.flatMap((name) => [name, ...name.split(" ")]);
  if (words.some((word) => word.startsWith(query))) return 0;
  if (item.ko.some((word) => initials(word).startsWith(query))) return 1;
  if (names.some((name) => name.includes(query))) return 2;
  return -1;
};

export function searchEmoji(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ALL.map((item) => ({ item, score: rank(item, q) }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => a.score - b.score)
    .map(({ item }) => item);
}
