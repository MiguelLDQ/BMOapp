import { Injectable, ServiceUnavailableException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMessageDto } from './chatbot.dto';

// Palavras-chave que indicam necessidade de resposta mais elaborada
const DEEP_KEYWORDS = [
  'por que', 'porque', 'explica', 'explique', 'como funciona', 'me ajuda',
  'não consigo', 'estou sofrendo', 'to sofrendo', 'tô sofrendo',
  'me sinto', 'sinto muito', 'muito triste', 'muito ansioso', 'muito ansiosa',
  'desesperado', 'desesperada', 'sem saída', 'não aguento', 'crise',
  'pânico', 'depressão', 'ansiedade', 'solidão', 'sozinho', 'sozinha',
  'chorei', 'chorando', 'preciso de ajuda', 'o que fazer', 'me aconselha',
  'conselho', 'dica', 'estratégia', 'técnica', 'exercício',
];

const QUICK_KEYWORDS = [
  'oi', 'olá', 'ola', 'tudo bem', 'ok', 'obrigado', 'obrigada',
  'valeu', 'entendi', 'sim', 'não', 'blz', 'beleza', 'certo',
  'show', 'legal', 'que horas', 'qual dia', 'bom dia', 'boa tarde', 'boa noite',
];

function classifyMessage(message: string): 'short' | 'medium' | 'long' {
  const lower = message.toLowerCase().trim();
  const wordCount = lower.split(/\s+/).length;

  // Mensagem muito curta (1-3 palavras) → resposta curta
  if (wordCount <= 3) {
    if (DEEP_KEYWORDS.some(kw => lower.includes(kw))) return 'medium';
    return 'short';
  }

  // Palavras que indicam crise ou pedido de ajuda aprofundado → resposta longa
  if (DEEP_KEYWORDS.some(kw => lower.includes(kw)) && wordCount > 5) return 'long';

  // Saudações ou confirmações simples → curta
  if (QUICK_KEYWORDS.some(kw => lower === kw || lower.startsWith(kw + ' '))) return 'short';

  // Mensagens médias (4-10 palavras sem keywords profundas) → média
  if (wordCount <= 10) return 'medium';

  // Mensagem longa do usuário → provavelmente quer resposta elaborada
  return 'long';
}

function buildSystemPrompt(responseLength: 'short' | 'medium' | 'long'): string {
  const lengthInstructions = {
    short: `TAMANHO DA RESPOSTA: Seja MUITO BREVE. Máximo 2-3 frases curtas. 
Sem listas, sem subtópicos. Responda de forma calorosa e direta.`,

    medium: `TAMANHO DA RESPOSTA: Seja MODERADO. Use 1 parágrafo de 3-5 frases.
Pode incluir uma pergunta de acompanhamento para entender melhor a situação.`,

    long: `TAMANHO DA RESPOSTA: Seja COMPLETO e DETALHADO. Use 2-4 parágrafos.
Pode incluir técnicas práticas, exercícios ou passos numerados quando apropriado.
Termine sempre com uma pergunta aberta para continuar o diálogo.`,
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

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);

  constructor(private config: ConfigService) {}

  async sendMessage(userId: string, dto: SendMessageDto) {
    const ollamaUrl = this.config.get<string>('ollama.url');
    const model = this.config.get<string>('ollama.model');

    const responseLength = classifyMessage(dto.message);
    const systemPrompt = buildSystemPrompt(responseLength);

    // Monta histórico de conversa (mantém contexto)
    const messages = [
      ...(dto.history || []).map((h) => ({
        role: h.role,
        content: h.content,
      })),
      { role: 'user', content: dto.message },
    ];

    this.logger.log(
      `[Chatbot] userId=${userId} | length=${responseLength} | msg="${dto.message.slice(0, 50)}..."`,
    );

    try {
      const response = await fetch(`${ollamaUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages,
          system: systemPrompt,
          stream: false,
          options: {
            temperature: 0.75,      // criatividade equilibrada
            top_p: 0.9,
            num_predict: responseLength === 'short' ? 150
                       : responseLength === 'medium' ? 350
                       : 800,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama retornou status ${response.status}`);
      }

      const data = await response.json() as any;
      const reply = data?.message?.content || data?.response || '';

      return {
        reply: reply.trim(),
        responseLength,
        model,
        tokensUsed: data?.eval_count || null,
      };
    } catch (error: any) {
      this.logger.error(`[Chatbot] Erro ao conectar no Ollama: ${error.message}`);
      throw new ServiceUnavailableException(
        'Serviço de IA temporariamente indisponível. Tente novamente em instantes.',
      );
    }
  }

  // Verifica se o Ollama está online
  async checkHealth() {
    const ollamaUrl = this.config.get<string>('ollama.url');
    try {
      const res = await fetch(`${ollamaUrl}/api/tags`);
      const data = await res.json() as any;
      const models = data?.models?.map((m: any) => m.name) || [];
      return { online: true, models };
    } catch {
      return { online: false, models: [] };
    }
  }
}
