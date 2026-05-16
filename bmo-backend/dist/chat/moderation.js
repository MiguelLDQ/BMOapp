"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moderateMessage = moderateMessage;
const BLOCKED_WORDS = [
    'idiota', 'imbecil', 'burro', 'burra', 'retardado', 'retardada',
    'viado', 'viadinho', 'sapatão', 'traveco',
    'negro', 'negra',
    'vagabundo', 'vagabunda', 'prostituta', 'puta', 'piranha',
    'merda', 'bosta', 'porra', 'caralho', 'fdp', 'filho da puta',
    'cuzão', 'cuzão', 'cu', 'buceta', 'pau',
    'odeio você', 'me mato', 'vou me matar', 'se mata', 'morra',
    'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'nigger',
];
function moderateMessage(content) {
    const lower = content.toLowerCase();
    for (const word of BLOCKED_WORDS) {
        const regex = new RegExp(`\\b${word.replace(/\s+/g, '\\s+')}\\b`, 'i');
        if (regex.test(lower)) {
            return {
                blocked: true,
                reason: 'Mensagem contém conteúdo ofensivo ou inadequado',
                flaggedWord: word,
            };
        }
    }
    if (content.length > 10 && content === content.toUpperCase() && /[A-Z]/.test(content)) {
        return {
            blocked: true,
            reason: 'Evite escrever em caixa alta (CAPS LOCK)',
        };
    }
    return { blocked: false };
}
//# sourceMappingURL=moderation.js.map