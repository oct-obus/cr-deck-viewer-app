// Evo/hero slot logic — shared between web and React Native
//
// Positional rules:
//   Index 0 → evo   (if card has evoIcon)
//   Index 1 → hero  (if card has heroIcon)
//   Index 2 → evo if available, otherwise hero

export function resolveSlotType(card, index) {
  if (!card) return { isEvo: false, isHero: false };
  if (index === 0) return { isEvo: !!card.evoIcon, isHero: false };
  if (index === 1) return { isEvo: false, isHero: !!card.heroIcon };
  if (index === 2) {
    if (card.evoIcon) return { isEvo: true, isHero: false };
    if (card.heroIcon) return { isEvo: false, isHero: true };
  }
  return { isEvo: false, isHero: false };
}

// Returns which image variant to use: 'icon', 'evoIcon', or 'heroIcon'
export function resolveCardImageKey(card, index) {
  if (!card) return 'icon';
  if (index === 0 && card.evoIcon) return 'evoIcon';
  if (index === 1 && card.heroIcon) return 'heroIcon';
  if (index === 2) {
    if (card.evoIcon) return 'evoIcon';
    if (card.heroIcon) return 'heroIcon';
  }
  return 'icon';
}
