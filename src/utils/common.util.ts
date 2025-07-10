export function buildLLMPrompt({ amount, currency, email, riskScore, isLargeAmount, isSuspiciousDomain, routedProvider }: {
  amount: number;
  currency: string;
  email: string;
  riskScore: number;
  isLargeAmount: boolean;
  isSuspiciousDomain: boolean;
  routedProvider?: string;
}) {
  let reason = [];
  if (isLargeAmount) reason.push('a large amount');
  if (isSuspiciousDomain) reason.push('a suspicious email domain');
  const reasonText = reason.length ? `based on ${reason.join(' and ')}` : 'with no major risk factors';
  if (routedProvider) {
    return `Reply with a concise, one-sentence summary only: This payment was routed to ${routedProvider} due to a risk score of ${riskScore.toFixed(2)} ${reasonText}.`;
  } else {
    return `Reply with a concise, one-sentence summary only: This payment was blocked due to a high risk score of ${riskScore.toFixed(2)} ${reasonText}.`;
  }
}

export function cleanLLMExplanation(text: string): string {
  const cleaned = text.replace(/^>\s?/, '').trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
} 