export const getEmojiType = (text = "") => {
  const trimmed = text.trim();

  if (!trimmed) return "text";

  const emojiRegex = /\p{Extended_Pictographic}/u;
  const emojiOnlyRegex = /^[\p{Extended_Pictographic}\s]+$/u;

  if (emojiOnlyRegex.test(trimmed)) return "emoji-only";
  if (emojiRegex.test(trimmed)) return "contains-emoji";

  return "text";
};

export const splitTextAndEmojis = (text = "") => {
  const regex = /(\p{Extended_Pictographic})/gu;

  return text.split(regex).filter(Boolean);
};
