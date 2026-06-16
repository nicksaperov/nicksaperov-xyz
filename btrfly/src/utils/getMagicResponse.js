const BE_HEARD_WORDS = new Set([
  'please',
  'kindly',
  'help',
  'listen',
  'hear',
  'share',
  'tell',
  'speak',
  'wait',
  'stop',
  'go',
  'come',
  'stay',
  'leave',
  'want',
  'need',
  'feel',
  'hope',
  'wish',
  'dream',
  'think',
  'know',
  'see',
  'look',
  'find',
  'give',
  'take',
  'make',
  'be',
  'am',
  'is',
  'are',
  'was',
  'were',
  'beautiful',
  'brave',
  'quiet',
  'loud',
  'soft',
  'hard',
  'true',
  'real',
  'open',
  'closed',
  'lost',
  'found',
  'sorry',
  'thanks',
  'thank',
]);

const VERB_SUFFIXES = /(ing|ed|ize|ise|ate|ify|en)$/i;
const ADJ_SUFFIXES = /(ful|less|ous|ive|al|ic|ed|ing|ary|ory)$/i;

export default function getMagicResponse(rawInput) {
  const input = rawInput.trim().toLowerCase();
  if (!input) return 'Be heard';

  if (input === 'love' || /\blove\b/.test(input)) {
    return 'i wish you love (noun).';
  }

  if (input.includes(' ')) return 'Be heard';

  if (BE_HEARD_WORDS.has(input)) return 'Be heard';

  if (VERB_SUFFIXES.test(input) || ADJ_SUFFIXES.test(input)) {
    return 'Be heard';
  }

  return 'Be heard';
}
