export function formatWhatsappMessage(items) {
  return ['רשימת קניות לשבת 🛒', ...items.map((item) => `• ${item}`)].join('\n');
}
