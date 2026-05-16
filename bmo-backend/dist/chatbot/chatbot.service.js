"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ChatbotService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const DEEP_KEYWORDS = [
    'por que', 'porque', 'explica', 'explique', 'como funciona', 'me ajuda',
    'não consigo', 'estou sofrendo', 'to sofrendo', 'tô sofrendo',
    'me sinto', 'sinto muito', 'muito triste', 'muito ansioso', 'muito ansiosa',
    'desesperado', 'desesperada', 'sem saída', 'não aguento', 'crise',
    'pânico', 'depressão', 'ansiedade', 'solidão', 'sozinho', 'sozinha',
    'chorei', 'chorando', 'preciso de ajuda', 'o que fazer', 'me aconselha',
    'conselho', 'dica', 'estratégia', 'técnica', 'exercício',
    'brigou', 'briga', 'discussão', 'mal', 'péssimo', 'horrível',
];
const QUICK_KEYWORDS = [
    'oi', 'olá', 'ola', 'tudo bem', 'ok', 'obrigado', 'obrigada',
    'valeu', 'entendi', 'sim', 'não', 'blz', 'beleza', 'certo',
    'show', 'legal', 'bom dia', 'boa tarde', 'boa noite',
];
function classifyMessage(message) {
    const lower = message.toLowerCase().trim();
    const wordCount = lower.split(/\s+/).length;
    if (wordCount <= 3) {
        if (DEEP_KEYWORDS.some(kw => lower.includes(kw)))
            return 'medium';
        return 'short';
    }
    if (DEEP_KEYWORDS.some(kw => lower.includes(kw)) && wordCount > 5)
        return 'long';
    if (QUICK_KEYWORDS.some(kw => lower === kw || lower.startsWith(kw + ' ')))
        return 'short';
    if (wordCount <= 10)
        return 'medium';
    return 'long';
}
function buildSystemPrompt(responseLength) {
    const lengthInstructions = {
        short: `TAMANHO DA RESPOSTA: Seja MUITO BREVE. Máximo 2-3 frases curtas. Sem listas, sem subtópicos. Responda de forma calorosa e direta.`,
        medium: `TAMANHO DA RESPOSTA: Seja MODERADO. Use 1 parágrafo de 3-5 frases. Pode incluir uma pergunta de acompanhamento para entender melhor a situação.`,
        long: `TAMANHO DA RESPOSTA: Seja COMPLETO e DETALHADO. Use 2-4 parágrafos. Pode incluir técnicas práticas, exercícios ou passos numerados quando apropriado. Termine sempre com uma pergunta aberta para continuar o diálogo.`,
    };
    return `Você é o BMO, um assistente de saúde mental gentil, empático e acolhedor.
Seu objetivo é apoiar o bem-estar emocional das pessoas de forma segura e responsável.

PERSONALIDADE:
- Fale sempre em português brasileiro, de forma natural e calorosa
- Nunca seja clínico ou frio — use linguagem humana e acessível
- Valide os sentimentos da pessoa antes de oferecer sugestões
- Nunca faça diagnósticos médicos ou psicológicos
- Se a pessoa demonstrar risco de se machucar, encaminhe gentilmente para o CVV (188)
- Use emojis com moderação para deixar a conversa mais leve quando apropriado

ÁREAS DE APOIO:
- Ansiedade e estresse do dia a dia
- Tristeza e desmotivação
- Autoestima e autoconhecimento
- Técnicas de respiração e mindfulness
- Organização e produtividade para saúde mental
- Relacionamentos e comunicação não-violenta

${lengthInstructions[responseLength]}

IMPORTANTE: Nunca invente informações médicas. Se o assunto exigir profissional de saúde,
diga isso com carinho e sem alarmismo.`;
}
let ChatbotService = ChatbotService_1 = class ChatbotService {
    config;
    logger = new common_1.Logger(ChatbotService_1.name);
    constructor(config) {
        this.config = config;
    }
    async sendMessage(userId, dto) {
        const groqApiKey = this.config.get('groq.apiKey');
        if (!groqApiKey) {
            throw new common_1.ServiceUnavailableException('Serviço de IA não configurado.');
        }
        const responseLength = classifyMessage(dto.message);
        const systemPrompt = buildSystemPrompt(responseLength);
        const messages = [
            ...(dto.history || []).map((h) => ({
                role: h.role,
                content: h.content,
            })),
            { role: 'user', content: dto.message },
        ];
        this.logger.log(`[Chatbot] userId=${userId} | length=${responseLength} | msg="${dto.message.slice(0, 50)}"`);
        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${groqApiKey}`,
                },
                body: JSON.stringify({
                    model: 'llama3-8b-8192',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...messages,
                    ],
                    temperature: 0.75,
                    max_tokens: responseLength === 'short' ? 150
                        : responseLength === 'medium' ? 350
                            : 800,
                }),
            });
            if (!response.ok) {
                const err = await response.text();
                throw new Error(`Groq retornou status ${response.status}: ${err}`);
            }
            const data = await response.json();
            const reply = data?.choices?.[0]?.message?.content || '';
            return {
                reply: reply.trim(),
                responseLength,
                model: 'llama3-8b-8192',
                tokensUsed: data?.usage?.total_tokens || null,
            };
        }
        catch (error) {
            this.logger.error(`[Chatbot] Erro ao conectar no Groq: ${error.message}`);
            throw new common_1.ServiceUnavailableException('Serviço de IA temporariamente indisponível. Tente novamente em instantes.');
        }
    }
    async checkHealth() {
        const groqApiKey = this.config.get('groq.apiKey');
        return {
            online: !!groqApiKey,
            model: 'llama3-8b-8192',
            provider: 'Groq',
        };
    }
};
exports.ChatbotService = ChatbotService;
exports.ChatbotService = ChatbotService = ChatbotService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ChatbotService);
//# sourceMappingURL=chatbot.service.js.map