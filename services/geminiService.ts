
import { GoogleGenAI } from "@google/genai";
import { Checkin, Insight } from '../types';

// A chave da API é injetada no escopo global (window) pelo index.html
const API_KEY = (window as any).GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;

// Função para inicializar o cliente da API de forma segura
const getGenAIClient = (): GoogleGenAI | null => {
    if (ai) {
        return ai;
    }
    // Verifica se a chave foi injetada e não é mais o placeholder
    if (API_KEY && API_KEY !== '__API_KEY_PLACEHOLDER__') {
        ai = new GoogleGenAI({ apiKey: API_KEY });
        return ai;
    }
    console.warn("API_KEY for Gemini is not set or invalid. Using mock data.");
    return null;
}


const generateInsightPrompt = (checkins: Checkin[]): string => {
  const summary = checkins.slice(-7).map(c => 
    `- Data: ${new Date(c.checkinDate).toLocaleDateString()}, Status: ${c.executionStatus}, Dificuldade: ${c.difficultyMoment}, Sabotagem: ${c.sabotageType}, Motivação: ${c.motivationType}, Energia: ${c.energyLevel}, Aprendizado: "${c.learnings}"`
  ).join('\n');

  return `
    Você é um coach de PNL e especialista em comportamento humano chamado "Mente Viva AI".
    Analise os seguintes dados de check-in de um usuário sobre seus hábitos na última semana e forneça um insight conciso e acionável.
    Seja empático, encorajador e direto.
    Identifique um padrão principal (ex: dificuldade em um período específico, tipo de sabotagem recorrente, ou correlação entre motivação e sucesso).
    Formate sua resposta como um objeto JSON com "title" e "message".
    O "title" deve ser uma pergunta ou uma afirmação curta e impactante.
    O "message" deve ser um parágrafo curto (2-3 frases) explicando o padrão e sugerindo uma pequena ação ou reflexão.

    Dados dos últimos 7 check-ins:
    ${summary}

    Exemplo de saída:
    {
      "title": "As tardes de terça-feira são seu maior desafio?",
      "message": "Notei que nas últimas terças-feiras à tarde você teve mais dificuldade em cumprir seu hábito. Que tal agendar uma pequena pausa de 5 minutos antes de começar, para recarregar as energias e ajustar seu foco?"
    }
  `;
};

export const getInsightFromCheckins = async (checkins: Checkin[]): Promise<Insight> => {
  const aiClient = getGenAIClient();
  if (!aiClient || checkins.length < 3) {
    return {
      title: "Continue Registrando!",
      message: "Com mais alguns dias de check-in, poderemos descobrir padrões e insights valiosos sobre sua jornada. Continue firme!"
    };
  }
  try {
    const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: generateInsightPrompt(checkins),
        config: {
          responseMimeType: 'application/json'
        }
    });

    const text = response.text.trim();
    // Clean potential markdown code block fences
    const cleanedText = text.replace(/^```json\s*|```\s*$/g, '');
    const parsed = JSON.parse(cleanedText);
    
    if (parsed.title && parsed.message) {
      return parsed;
    }
    throw new Error('Invalid JSON structure from Gemini');
  } catch (error) {
    console.error("Error generating insight with Gemini:", error);
    return {
      title: "Reflexão do Dia",
      message: "Qual foi o maior aprendizado que você teve sobre si mesmo hoje? Anotar suas reflexões pode revelar padrões importantes."
    };
  }
};


const generateMotivationalPhrasePrompt = () => {
    return `
      Você é um coach de hábitos chamado "Mente Viva AI". Sua personalidade é de um amigo inteligente, engraçado e um pouco nerd sobre neurociência.
      Crie uma reflexão curta, amigável e espirituosa sobre criar hábitos.
      Use uma analogia simples e divertida, talvez até um pouco boba, baseada em neurociência, mas explicada de forma que qualquer um entenda. Evite jargões complexos e clichês motivacionais.
      O objetivo é fazer a pessoa sorrir e se sentir mais leve sobre o processo de mudança.
      Formate sua resposta como um objeto JSON com "title" e "phrase".
      O "title" deve ser curto, divertido e curioso.
      A "phrase" deve ter no máximo 3 frases.

      Exemplo de saída 1:
      {
        "title": "Seu Cérebro é um Filhotinho",
        "phrase": "Pense no seu novo hábito como ensinar um filhote a sentar. No começo ele vai se distrair, mas com repetição e um 'biscoito' (uma pequena recompensa), ele cria um novo truque. Seja paciente com seu filhotinho cerebral!"
      }
      Exemplo de saída 2:
      {
        "title": "O GPS dos Neurônios",
        "phrase": "Cada vez que você repete um hábito, é como asfaltar uma estradinha de terra no seu cérebro. No início é difícil, mas logo vira uma autoestrada lisa onde seus neurônios dirigem no piloto automático. Apenas continue pavimentando!"
      }
    `;
};


export const getMotivationalPhrase = async (): Promise<{title: string, phrase: string}> => {
    const aiClient = getGenAIClient();
    if (!aiClient) {
        return {
            title: "Construa a Ponte",
            phrase: "Cada pequena ação é um tijolo na ponte que leva você do seu estado atual para o seu estado desejado. Construa com paciência e consistência."
        };
    }
    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: generateMotivationalPhrasePrompt(),
            config: {
              responseMimeType: 'application/json'
            }
        });
        
        const text = response.text.trim();
        const cleanedText = text.replace(/^```json\s*|```\s*$/g, '');
        const parsed = JSON.parse(cleanedText);

        if (parsed.title && parsed.phrase) {
            return parsed;
        }
        throw new Error('Invalid JSON structure from Gemini for motivational phrase');

    } catch (error) {
        console.error("Error generating motivational phrase with Gemini:", error);
        return {
            title: "O Poder do 'Agora'",
            phrase: "A mudança de hábito não acontece amanhã, acontece na decisão que você toma neste exato momento. Honre seu compromisso com o seu 'eu' do futuro, agindo agora."
        };
    }
};