/**
 * Shared evo/hero slot logic.
 *
 * Positional rules:
 *   Index 0 → evo   (if card has evoIcon)
 *   Index 1 → hero   (if card has heroIcon)
 *   Index 2 → evo if available, otherwise hero (evo takes priority)
 *
 * These rules always apply based on position alone.
 */

/**
 * Returns the display icon URL for a card at a given deck position.
 * @param {object} card  - card data object with .icon, .evoIcon, .heroIcon
 * @param {number} index - 0-based position in the deck (0-7)
 * @returns {string} icon URL
 */
export function resolveCardIcon(card, index) {
  if (!card) return '';
  if (index === 0 && card.evoIcon) return card.evoIcon;
  if (index === 1 && card.heroIcon) return card.heroIcon;
  if (index === 2) {
    if (card.evoIcon) return card.evoIcon;
    if (card.heroIcon) return card.heroIcon;
  }
  return card.icon;
}

/**
 * Returns { isEvo, isHero } flags for a card at a given deck position.
 * @param {object} card  - card data object with .evoIcon, .heroIcon
 * @param {number} index - 0-based position in the deck (0–7)
 * @returns {{ isEvo: boolean, isHero: boolean }}
 */
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

/**
 * Returns which image property key to use: 'icon', 'evoIcon', or 'heroIcon'.
 * @param {object} card  - card data object with .evoIcon, .heroIcon
 * @param {number} index - 0-based position in the deck (0-7)
 * @returns {string} property key
 */
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
