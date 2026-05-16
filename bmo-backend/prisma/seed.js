"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const tasks = [
        { title: 'Beber 2L de água', category: 'Saúde' },
        { title: 'Caminhar 30 minutos', category: 'Saúde' },
        { title: 'Dormir antes da meia-noite', category: 'Saúde' },
        { title: 'Tomar sol por 15 minutos', category: 'Saúde' },
        { title: 'Beber chá ou suco natural', category: 'Saúde' },
        { title: 'Evitar açúcar hoje', category: 'Saúde' },
        { title: 'Comer pelo menos 2 frutas', category: 'Saúde' },
        { title: 'Evitar frituras hoje', category: 'Saúde' },
        { title: 'Tomar vitaminas ou suplementos', category: 'Saúde' },
        { title: 'Fazer uma refeição sem celular', category: 'Saúde' },
        { title: 'Dormir pelo menos 7 horas esta noite', category: 'Saúde' },
        { title: 'Fazer 20 alongamentos', category: 'Exercício' },
        { title: 'Fazer 30 agachamentos', category: 'Exercício' },
        { title: 'Fazer 20 flexões', category: 'Exercício' },
        { title: 'Subir escadas em vez de elevador', category: 'Exercício' },
        { title: 'Dançar por 10 minutos', category: 'Exercício' },
        { title: 'Fazer yoga por 15 minutos', category: 'Exercício' },
        { title: 'Pedalar por 20 minutos', category: 'Exercício' },
        { title: 'Meditar por 10 minutos', category: 'Bem-estar' },
        { title: 'Escrever 3 coisas pelas quais é grato', category: 'Bem-estar' },
        { title: 'Praticar respiração profunda', category: 'Bem-estar' },
        { title: 'Desligar o celular por 1 hora', category: 'Bem-estar' },
        { title: 'Ouvir uma música que te deixa feliz', category: 'Bem-estar' },
        { title: 'Escrever como você está se sentindo hoje', category: 'Bem-estar' },
        { title: 'Fazer algo que te dá prazer por 20 minutos', category: 'Bem-estar' },
        { title: 'Fazer uma lista de prioridades do dia', category: 'Produtividade' },
        { title: 'Organizar sua mesa de trabalho', category: 'Produtividade' },
        { title: 'Evitar redes sociais por 1 hora', category: 'Produtividade' },
        { title: 'Completar uma tarefa que está adiando', category: 'Produtividade' },
        { title: 'Responder emails ou mensagens pendentes', category: 'Produtividade' },
        { title: 'Planejar sua semana por 10 minutos', category: 'Produtividade' },
        { title: 'Fazer uma coisa de cada vez sem multitarefa', category: 'Produtividade' },
        { title: 'Ler por 20 minutos', category: 'Aprendizado' },
        { title: 'Estudar algo novo por 15 minutos', category: 'Aprendizado' },
        { title: 'Assistir a um documentário ou aula', category: 'Aprendizado' },
        { title: 'Aprender 5 palavras em outro idioma', category: 'Aprendizado' },
        { title: 'Ouvir um podcast educativo', category: 'Aprendizado' },
        { title: 'Ligar para alguém querido', category: 'Social' },
        { title: 'Mandar uma mensagem de carinho para alguém', category: 'Social' },
        { title: 'Ajudar alguém com algo pequeno hoje', category: 'Social' },
        { title: 'Fazer um elogio sincero para alguém', category: 'Social' },
        { title: 'Limpar um cômodo da casa', category: 'Organização' },
        { title: 'Organizar sua roupa do dia anterior', category: 'Organização' },
        { title: 'Lavar a louça acumulada', category: 'Organização' },
        { title: 'Jogar fora algo que não usa mais', category: 'Organização' },
        { title: 'Organizar seus arquivos digitais', category: 'Organização' },
    ];
    for (const task of tasks) {
        await prisma.dailyTask.upsert({
            where: { title: task.title },
            update: {},
            create: task,
        });
    }
    console.log('Seeds criados com sucesso!');
}
main().finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map