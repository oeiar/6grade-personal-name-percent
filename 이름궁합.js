const hummans = [
  "박성현", // 1m
  "정성준", // 2m
  "길도윤", // 3m
  "명재윤", // 1w
  "가도원", // 2w
  "강서윤", // 3w
  "강은찬", // 4m
  "김범수", // 5m
  "김시호", // 6m
  "김은오", // 4w
  "김지윤", // 5w
  "김효인", // 6w
  "박주원", // 7m
  "박지빈", // 7w
  "신민서", // 8w
  "오예준", // 8m
  "이소연", // 9w
  "정시우", // 9m
  "정연준", // 10m
  "정하윤", // 10w
  "조환", // 11m
  "차민오", // 12m
  "최현서", // 11w
  "정준우", // 13m
];
const fs = require("fs");

const BASE = "가".charCodeAt(0); // 한글 코드 시작: 44032
const INITIALS = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];
const MEDIALS = [
  "ㅏ",
  "ㅐ",
  "ㅑ",
  "ㅒ",
  "ㅓ",
  "ㅔ",
  "ㅕ",
  "ㅖ",
  "ㅗ",
  "ㅘ",
  "ㅙ",
  "ㅚ",
  "ㅛ",
  "ㅜ",
  "ㅝ",
  "ㅞ",
  "ㅟ",
  "ㅠ",
  "ㅡ",
  "ㅢ",
  "ㅣ",
];
const FINALES = [
  "",
  "ㄱ",
  "ㄲ",
  "ㄳ",
  "ㄴ",
  "ㄵ",
  "ㄶ",
  "ㄷ",
  "ㄹ",
  "ㄺ",
  "ㄻ",
  "ㄼ",
  "ㄽ",
  "ㄾ",
  "ㄿ",
  "ㅀ",
  "ㅁ",
  "ㅂ",
  "ㅄ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];
const STROKES = {
  "": 0,
  ㄱ: 2,
  ㄲ: 4,
  ㄴ: 2,
  ㄷ: 3,
  ㄸ: 6,
  ㄹ: 5,
  ㅁ: 4,
  ㅂ: 4,
  ㅃ: 8,
  ㅅ: 2,
  ㅆ: 4,
  ㅇ: 1,
  ㅈ: 3,
  ㅉ: 6,
  ㅊ: 4,
  ㅋ: 3,
  ㅌ: 4,
  ㅍ: 4,
  ㅎ: 3,
  ㄳ: 4,
  ㄵ: 5,
  ㄶ: 5,
  ㄺ: 7,
  ㄻ: 9,
  ㄼ: 9,
  ㄽ: 7,
  ㄾ: 9,
  ㄿ: 9,
  ㅀ: 8,
  ㅄ: 6,
  ㅏ: 2,
  ㅐ: 3,
  ㅑ: 3,
  ㅒ: 4,
  ㅓ: 2,
  ㅔ: 3,
  ㅕ: 3,
  ㅖ: 4,
  ㅗ: 2,
  ㅘ: 4,
  ㅙ: 5,
  ㅚ: 3,
  ㅛ: 3,
  ㅜ: 2,
  ㅝ: 4,
  ㅞ: 5,
  ㅟ: 3,
  ㅠ: 3,
  ㅡ: 1,
  ㅢ: 2,
  ㅣ: 1,
};
function getSymbol(char) {
  if (!char.match(/[ㄱ-ㅎ가-힣]/)) {
    return false;
  }
  let initial = "";
  let medial = "";
  let finale = "";
  if (char.match(/[ㄱ-ㅎ]/)) {
    initial = char;
  } else {
    const tmp = char.charCodeAt(0) - BASE;
    const finaleOffset = tmp % FINALES.length;
    const medialOffset =
      ((tmp - finaleOffset) / FINALES.length) % MEDIALS.length;
    const initialOffset =
      ((tmp - finaleOffset) / FINALES.length - medialOffset) / MEDIALS.length;
    initial = INITIALS[initialOffset];
    medial = MEDIALS[medialOffset];
    finale = FINALES[finaleOffset];
  }
  const initialStrokes = STROKES[initial];
  const medialStrokes = STROKES[medial];
  const finaleStrokes = STROKES[finale];
  return {
    initial,
    medial,
    finale,
    initialStrokes,
    medialStrokes,
    finaleStrokes,
    numOfStrokes: initialStrokes + medialStrokes + finaleStrokes,
  };
}

function getScore(name1, name2) {
  const symbols1 = name1
    .match(/[\s\S]/g)
    .map((char) => [char, getSymbol(char).numOfStrokes]);
  const symbols2 = name2
    .match(/[\s\S]/g)
    .map((char) => [char, getSymbol(char).numOfStrokes]);
  const maxLen = Math.max(symbols1.length, symbols2.length);
  const [chars, numbers] = Array(maxLen)
    .fill()
    .reduce(
      ([accum1, accum2], e, i) => {
        const [char1, num1] = symbols1[i] || ["", 0];
        const [char2, num2] = symbols2[i] || ["", 0];
        return [
          [...accum1, char1, char2],
          [...accum2, num1, num2],
        ];
      },
      [[], []]
    );
  let nums = numbers.slice();
  const stages = [nums];
  while (nums.length > 2 && nums.join("") !== "100") {
    nums = nums.reduce((a, e, i, arr) => {
      if (i < arr.length - 1) {
        return [...a, (e + arr[i + 1]) % 10];
      }
      return a;
    }, []);
    stages.push(nums);
  }
  return { chars, stages, score: ~~stages.slice(-1)[0].join("") };
}

let jsn = {};

let out = "," + hummans.join(",") + "\n";
for (let i = 0; i < hummans.length; i++) {
  out += hummans[i] + ",";

  for (let j = 0; j < hummans.length; j++) {
    let p1 = hummans[i];
    let p2 = hummans[j];

    let score = getScore(p1, p2).score;
    if (jsn[score] == undefined) {
      jsn[score] = [];
    }
    jsn[score].push(`${p1} -> ${p2}`);
    out += score.toString() + ",";
  }

  out = out.slice(0, out.length - 1);

  out += "\n";
}

let out2 = "";
let ks = Object.keys(jsn);
for (let i = ks.length - 1; i >= 0; i--) {
  let k = ks[i];
  out2 += k.toString() + "\n";
  for (let j = 0; j < jsn[k].length; j++) {
    let n = jsn[k][j];
    out2 += "\t" + n + "\n";
  }
  out2 += "\n";
}
fs.writeFileSync(__dirname + "/이름궁합.csv", out);
fs.writeFileSync(__dirname + "/이름궁합L.txt", out2);
