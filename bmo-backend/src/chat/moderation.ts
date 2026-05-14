// Lista de palavras ofensivas — expanda conforme necessário
const BLOCKED_WORDS = [
  // Xingamentos comuns em PT-BR
  'idiota', 'imbecil', 'burro', 'burra', 'retardado', 'retardada',
  'viado', 'viadinho', 'sapatão', 'traveco',
  'negro', 'negra', // quando usado como xingamento — contexto sensível
  'vagabundo', 'vagabunda', 'prostituta', 'puta', 'piranha',
  'merda', 'bosta', 'porra', 'caralho', 'fdp', 'filho da puta',
  'cuzão', 'cuzão', 'cu', 'buceta', 'pau',
  'odeio você', 'me mato', 'vou me matar', 'se mata', 'morra',
  // Inglês básico
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'nigger',
];

export interface ModerationResult {
  blocked: boolean;
  reason?: string;
  flaggedWord?: string;
}

export function moderateMessage(content: string): ModerationResult {
  const lower = content.toLowerCase();

  for (const word of BLOCKED_WORDS) {
    // Usa regex com word boundary para evitar falso-positivo
    const regex = new RegExp(`\\b${word.replace(/\s+/g, '\\s+')}\\b`, 'i');
    if (regex.test(lower)) {
      return {
        blocked: true,
        reason: 'Mensagem contém conteúdo ofensivo ou inadequado',
        flaggedWord: word,
      };
    }
  }

  // Detecta flood (mensagem toda em maiúscula com mais de 10 chars)
  if (content.length > 10 && content === content.toUpperCase() && /[A-Z]/.test(content)) {
    return {
      blocked: true,
      reason: 'Evite escrever em caixa alta (CAPS LOCK)',
    };
  }

  return { blocked: false };
}
