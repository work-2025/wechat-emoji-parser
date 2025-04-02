// 全局声明文件（如 global.d.ts）
interface Window {
  location: Location;
}

declare interface EmojiData {
  cn: string
  hk?: string
  us?: string
  code: string
  web_code?: string
  src: string
  emoji?: string
}

declare interface EmojiParserOption {
  size?: number // emoji 大小，单位px 默认64
  tag?: string // 解析后的html标签，默认a
  useBackground?: boolean // 是否不显示背景 默认false
}

declare interface EmojiStyle {
  display: string
  width: string
  height: string
  'vertical-align'?: string
  background?: string
  'background-size'?: string
}

declare interface Emoji {
  code?: string // emoji对应的编码，如：/:@>
  cn: string // 中文显示，如：[右哼哼]
  src: string | URL // emoji图片路径
  name?: string
  style?: EmojiStyle | string
}
