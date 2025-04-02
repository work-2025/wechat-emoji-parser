import { EMOJI_DATA } from './config/emoji'
import { getEmojiStyle } from './parser'
// import { base64ToBlobUrl } from './utils/uitl'

export function getEmojisByEmojiData(emojiData: EmojiData[]) {
  return function (option: EmojiParserOption | undefined): Emoji[] {
    let emojiOption: EmojiParserOption = {
      size: 64,
    }
    if (option) {
      emojiOption = Object.assign(emojiOption, option)
    }
    return emojiData.map(({ code, cn, src }) => {
      let style = (src && getEmojiStyle(src, emojiOption)) || ({} as EmojiStyle)
      let name = cn.replace(/\[(.*?)\]/i, "$1")
      //return { style, code, cn, name }
      // return { src, code, cn, name, style }
      return { src, cn, name }
    })
  }
}

export const getEmojis = getEmojisByEmojiData(EMOJI_DATA)
