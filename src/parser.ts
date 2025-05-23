import Trie from './utils/trie'
import { EMOJI_DATA, EMOJI_KEY_RELATE_EMOJI_INDEX } from './config/emoji'
import { stringSplice, isWin } from './utils/uitl'
const emojiKeys = Object.keys(EMOJI_KEY_RELATE_EMOJI_INDEX)
const trie = new Trie(emojiKeys)

function parseHtmlString(html: string) {
  return html.split(/(<[^>]+>)/g).filter(Boolean);
}

export function getEmojiStyle(
  src: string,
  emojiOption: EmojiParserOption,
): EmojiStyle {
  const emojiSize = emojiOption.size as number
  const useBackground = typeof emojiOption.useBackground !== 'undefined' ? emojiOption.useBackground : true
  const style: EmojiStyle = {
    display: 'inline-block',
    width: `${emojiSize}px`,
    height: `${emojiSize}px`,
    'vertical-align': isWin() ? 'text-bottom' :  'text-top',
    // background: `url(${src}) no-repeat`,
    // 'background-size': `${emojiSize}px`,
  }

  if (useBackground) {
    style.background = `url(${src}) no-repeat`
    style['background-size'] = `${emojiSize}px`
  }

  return style
}

export function transform2Html(
  name: string,
  index: number,
  emojiOption: EmojiParserOption,
): string {
  const tag = emojiOption.tag as string
  let style = ''
  let styleObj = getEmojiStyle(EMOJI_DATA[index].src, emojiOption)

  if (styleObj) {
    Object.keys(styleObj).forEach((key: keyof EmojiStyle) => {
      styleObj[key] !== undefined && (style += `${key}: ${styleObj[key]};`)
    })
  }

  if (tag.toLowerCase() === 'img') {
    return `<${tag} class="wx-emoji" src="${EMOJI_DATA[index].src}" style="${style}" alt="${name}" draggable="false" />`
  }

  return `<${tag} title="${name}" class="wx-emoji" style="${style}" draggable="false" ></${tag}>`
}

const defaultEmojiOption: EmojiParserOption = {
  size: 64,
  tag: 'a',
  useBackground: true,
}

// 转义HTML
function escapeHtml(str: string): string {
  const escapeMap: Record<string, string> = {
    // '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    // '"': '&quot;',
    // "'": '&#39;',
    // '/': '&#x2F;'
  };
  // return str.replace(/[&<>"'\/]/g, (m) => escapeMap[m]);
  return str.replace(/[<>]/g, (m) => escapeMap[m]);
}

export function handleParseEmoji(str: string, isSafe: boolean = false, format: string = "html"): string | any[] {
  if (!str) return str
  if (isSafe) {
    str = escapeHtml(str)
  }
  let matchedEmoji = trie.search(str)

  if (format === "array") {
    return matchedEmoji.reverse().map(([emojiIndex, keyIndex]) => {
    let name = emojiKeys[keyIndex],
      index = EMOJI_KEY_RELATE_EMOJI_INDEX[name]
      return EMOJI_DATA[index];
    });
  }

  matchedEmoji.reverse().map(([emojiIndex, keyIndex]) => {
    let name = emojiKeys[keyIndex],
      index = EMOJI_KEY_RELATE_EMOJI_INDEX[name]
    let html = transform2Html(name, index, defaultEmojiOption)
    str = stringSplice(str, emojiIndex, name.length, html)
  })
  return str
}

export function configParseEmoji(option: EmojiParserOption | undefined) {
  if (option) {
    Object.assign(defaultEmojiOption, option)
  }
}

// console.log(parseEmoji("[囧]235432523[抠鼻]22132424[翻白眼][加油加油][加油加油][加油加油]"))
// console.log(parseEmoji('<a target="_blank" href="https://meet.2tianxin.com/website[抱拳]">https://meet.2tianxin.com/website[抱拳]</a>')
export function parseEmoji(str: string, isSafe: boolean = false, format: string = "html"): string | any[] {
  const isHtml = format === "html"

  if (!str) {
    return isHtml ? str : []
  }

  const strArr = parseHtmlString(str)
  const result = []

  if (strArr && strArr.length) {
    for (let i = 0; i < strArr.length; i++) {
      const item = strArr[i]

      if (
        /(<[^>]+>)/g.test(item) ||
        /((&lt;)[^>]+(&gt;))/g.test(item)
      ) {
        if (isHtml) {
          result.push(item)
        }
      } else {
        const res = handleParseEmoji(item, isSafe, format)

        if (isHtml) {
          result.push(res)
        } else {
          result.push(...res)
        }
      }
    }
  } else {
    return isHtml ? str : []
  }

  return isHtml ? result.join('') : result
}
