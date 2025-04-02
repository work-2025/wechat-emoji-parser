export function stringSplice(
  str: string,
  index: number,
  count: number,
  addedStr: string,
) {
  return str.slice(0, index) + addedStr + str.slice(index + count)
}

export function base64ToBlobUrl(base64Data: string): string {
  // 1. 提取 Base64 数据和 MIME 类型
  const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid Base64 data format");
  }
  const mimeType = matches[1]; // MIME 类型，例如 "image/png"
  const base64Content = matches[2]; // 实际的 Base64 编码内容

  // 2. 将 Base64 数据解码为二进制数据
  const byteCharacters = atob(base64Content); // 解码 Base64
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // 3. 创建 Blob 对象
  const blob = new Blob([byteArray], { type: mimeType });

  // 4. 生成 Blob URL
  const blobUrl = URL.createObjectURL(blob);

  return blobUrl;
}

export function isWin(): boolean {
  const platform = (navigator as any)?.platform;
  const userAgent = (navigator as any)?.userAgent;

  if (platform?.includes("Win") || /Windows/i.test(userAgent)) {
    return true;
  } else {
    return false
  }
}
