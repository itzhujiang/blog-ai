/**
 * 评论首字母头像组件
 * 取名字首字符（中文第一字 / 英文首字母大写），
 * 背景色由 name 的 charCode hash 从 8 色色板中选取
 */

const AVATAR_COLORS = [
  'bg-amber-500',
  'bg-emerald-500',
  'bg-sky-500',
  'bg-violet-500',
  'bg-rose-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-indigo-500',
];

function getInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const first = trimmed[0];
  // 中文字符直接返回
  if (/[\u4e00-\u9fff]/.test(first)) return first;
  return first.toUpperCase();
}

function getColorClass(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

interface CommentAvatarProps {
  name: string;
}

export function CommentAvatar({ name }: CommentAvatarProps) {
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center
        rounded-full text-sm font-bold text-white ${getColorClass(name)}`}
    >
      {getInitial(name)}
    </div>
  );
}
