export function getInitial(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return 'A'
  return trimmed.charAt(0).toUpperCase()
}
