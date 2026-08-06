const BLOCKED_KEYWORDS = [
  'ロリ', 'ロ●ータ', 'ロリータ', '少女', '幼女', '幼い', '子供', '子ども',
  'JS', 'JC', 'JK', '女子小学生', '女子中学生', '初潮', 'いたいけ',
  'あどけない', '子役', 'キッズ',
];

export function isSafe(...fields: string[]): boolean {
  const haystack = fields.join(' ');
  return !BLOCKED_KEYWORDS.some((keyword) => haystack.toLowerCase().includes(keyword.toLowerCase()));
}
