
import { Test, Archetype } from '../types';
import { Brain, Heart, ShieldQuestion } from 'lucide-react';

export const BEHAVIORAL_TESTS: Test[] = [
  {
    id: 'controle-executivo',
    title: 'Teste de Controle Executivo',
    icon: Brain,
    archetypes: [Archetype.GUARDIAN, Archetype.WANDERER, Archetype.WIND],
    questions: [
      { id: 1, text: 'Quando surge uma tentação de adiar o hábito planejado, você:', answers: [
          { text: 'Consigo resistir e manter o hábito', archetype: Archetype.GUARDIAN },
          { text: 'Às vezes cedo, mas tento compensar depois', archetype: Archetype.WANDERER },
          { text: 'Normalmente cedo e deixo para outro momento', archetype: Archetype.WIND },
      ]},
      { id: 2, text: 'Durante tarefas importantes, se algo divertido surge, você:', answers: [
          { text: 'Ignoro e continuo focado', archetype: Archetype.GUARDIAN },
          { text: 'Dou uma pausa rápida e volto', archetype: Archetype.WANDERER },
          { text: 'Desvio totalmente e esqueço a tarefa', archetype: Archetype.WIND },
      ]},
      { id: 3, text: 'Quando sente cansaço físico ou mental, você:', answers: [
          { text: 'Mantém a disciplina', archetype: Archetype.GUARDIAN },
          { text: 'Tenta, mas diminui a intensidade', archetype: Archetype.WANDERER },
          { text: 'Desiste completamente', archetype: Archetype.WIND },
      ]},
      { id: 4, text: 'Se alguém te interrompe durante a execução do hábito, você:', answers: [
          { text: 'Retoma rapidamente', archetype: Archetype.GUARDIAN },
          { text: 'Leva tempo para voltar', archetype: Archetype.WANDERER },
          { text: 'Desiste ou perde totalmente o ritmo', archetype: Archetype.WIND },
      ]},
      { id: 5, text: 'Ao planejar seu dia, você:', answers: [
          { text: 'Segue o cronograma fielmente', archetype: Archetype.GUARDIAN },
          { text: 'Segue parcialmente', archetype: Archetype.WANDERER },
          { text: 'Ignora o planejamento', archetype: Archetype.WIND },
      ]},
      { id: 6, text: 'Quando enfrenta distrações internas (pensamentos, preguiça), você:', answers: [
          { text: 'Reconhece e controla', archetype: Archetype.GUARDIAN },
          { text: 'Às vezes controla, às vezes não', archetype: Archetype.WANDERER },
          { text: 'Cede facilmente', archetype: Archetype.WIND },
      ]},
      { id: 7, text: 'Ao lidar com tarefas difíceis, você:', answers: [
          { text: 'Começa imediatamente', archetype: Archetype.GUARDIAN },
          { text: 'Hesita, mas eventualmente começa', archetype: Archetype.WANDERER },
          { text: 'Postergar se torna padrão', archetype: Archetype.WIND },
      ]},
      { id: 8, text: 'Quando falha uma vez, você:', answers: [
          { text: 'Volta ao hábito imediatamente', archetype: Archetype.GUARDIAN },
          { text: 'Tenta depois de algum tempo', archetype: Archetype.WANDERER },
          { text: 'Desiste ou procrastina semanas', archetype: Archetype.WIND },
      ]},
      { id: 9, text: 'Em situações de pressão externa, você:', answers: [
          { text: 'Mantém a rotina', archetype: Archetype.GUARDIAN },
          { text: 'Ajusta parcialmente a execução', archetype: Archetype.WANDERER },
          { text: 'Rompe a rotina', archetype: Archetype.WIND },
      ]},
      { id: 10, text: 'Quando planeja metas de longo prazo, você:', answers: [
          { text: 'Mantém foco mesmo sem supervisão', archetype: Archetype.GUARDIAN },
          { text: 'Precisa de lembretes frequentes', archetype: Archetype.WANDERER },
          { text: 'Normalmente abandona metas', archetype: Archetype.WIND },
      ]},
    ],
    results: [
      { archetype: Archetype.GUARDIAN, behaviorPattern: 'Consegue manter foco mesmo diante de distrações ou cansaço; raramente adia tarefas importantes. Tem rotina estruturada e cumpre o que planeja.', habitImpact: 'Alto índice de sucesso na execução, pouco suscetível a sabotagens. Sua consistência garante progresso gradual e sustentável.', interventionTips: 'Para se desafiar ainda mais, defina metas maiores ou complexas, use checkpoints semanais e mantenha hábitos de automonitoramento. Pode explorar micro-adaptações para otimizar energia e foco.' },
      { archetype: Archetype.WANDERER, behaviorPattern: 'Consegue manter hábitos parcialmente, mas cede a distrações, cansaço ou pequenas adversidades. Alterna dias de execução perfeita com dias de falha.', habitImpact: 'Progresso irregular; padrões de recaída podem gerar frustração e desmotivação.', interventionTips: 'Use planejamento visual, micro-hábitos, lembretes externos e recompensas rápidas. Priorize consistência em vez de perfeição; identificar gatilhos de distração ajuda a reduzir falhas.' },
      { archetype: Archetype.WIND, behaviorPattern: 'Baixo controle executivo; tende a procrastinar, ceder facilmente à tentação e abandonar metas. Falta de estrutura interna gera altos índices de autossabotagem.', habitImpact: 'Dificuldade crônica em manter hábitos sem acompanhamento ou reforço externo. Há risco de abandono frequente de projetos.', interventionTips: 'Reduza barreiras físicas e psicológicas para o hábito, use reforço externo constante, micro-passos diários, acompanhamento próximo e auto-monitoramento com visualização de progresso.' },
    ],
  },
  {
    id: 'sensibilidade-recompensa',
    title: 'Teste de Sensibilidade à Recompensa',
    icon: Heart,
    archetypes: [Archetype.FIRE, Archetype.MIRROR, Archetype.MAZE],
    questions: [
        { id: 1, text: 'Você mantém um hábito mais por:', answers: [
            { text: 'Satisfação pessoal', archetype: Archetype.FIRE },
            { text: 'Feedback de outros', archetype: Archetype.MIRROR },
            { text: 'Difícil manter, mesmo com recompensa', archetype: Archetype.MAZE },
        ]},
        { id: 2, text: 'Ao atingir uma meta, você prefere:', answers: [
            { text: 'Sentir orgulho pessoal', archetype: Archetype.FIRE },
            { text: 'Receber reconhecimento', archetype: Archetype.MIRROR },
            { text: 'Não sente muita diferença', archetype: Archetype.MAZE },
        ]},
        { id: 3, text: 'Quando a recompensa é adiada, você:', answers: [
            { text: 'Continua firme', archetype: Archetype.FIRE },
            { text: 'Fica desmotivado, mas tenta', archetype: Archetype.MIRROR },
            { text: 'Desiste', archetype: Archetype.MAZE },
        ]},
        { id: 4, text: 'Você gosta de desafios que testam sua disciplina:', answers: [
            { text: 'Sim, me motivam', archetype: Archetype.FIRE },
            { text: 'Às vezes', archetype: Archetype.MIRROR },
            { text: 'Evito', archetype: Archetype.MAZE },
        ]},
        { id: 5, text: 'Se outra pessoa elogia seu progresso, você:', answers: [
            { text: 'Aprecia, mas não depende disso', archetype: Archetype.FIRE },
            { text: 'Fica mais motivado', archetype: Archetype.MIRROR },
            { text: 'Não faz diferença', archetype: Archetype.MAZE },
        ]},
        { id: 6, text: 'Quando se sente cansado, você se mantém no hábito por:', answers: [
            { text: 'Propósito interno', archetype: Archetype.FIRE },
            { text: 'Medo de falhar para outros', archetype: Archetype.MIRROR },
            { text: 'Difícil resistir', archetype: Archetype.MAZE },
        ]},
        { id: 7, text: 'Ao planejar hábitos, você prioriza:', answers: [
            { text: 'Benefício pessoal', archetype: Archetype.FIRE },
            { text: 'Aparência para os outros', archetype: Archetype.MIRROR },
            { text: 'Evita planejar', archetype: Archetype.MAZE },
        ]},
        { id: 8, text: 'Você costuma iniciar hábitos por:', answers: [
            { text: 'Autoaperfeiçoamento', archetype: Archetype.FIRE },
            { text: 'Influência social', archetype: Archetype.MIRROR },
            { text: 'Difícil iniciar', archetype: Archetype.MAZE },
        ]},
        { id: 9, text: 'Para manter hábitos a longo prazo, você precisa de:', answers: [
            { text: 'Auto-motivação', archetype: Archetype.FIRE },
            { text: 'Recompensa externa', archetype: Archetype.MIRROR },
            { text: 'Dificuldade constante para manter', archetype: Archetype.MAZE },
        ]},
        { id: 10, text: 'Quando falha, você:', answers: [
            { text: 'Reavalia e volta sozinho', archetype: Archetype.FIRE },
            { text: 'Busca ajuda ou encorajamento', archetype: Archetype.MIRROR },
            { text: 'Abandona por frustração', archetype: Archetype.MAZE },
        ]},
    ],
    results: [
      { archetype: Archetype.FIRE, behaviorPattern: 'Altamente motivado por objetivos internos. Busca realização pessoal, sente prazer no progresso e é autossuficiente para manter hábitos sem depender de validação externa.', habitImpact: 'Costuma manter consistência, mesmo quando recompensas externas estão ausentes. Resiliência alta diante de obstáculos.', interventionTips: 'Use metas desafiadoras e propósito claro. Incentive auto-reflexão, registro de conquistas e reforço positivo interno. Explore estratégias de autodesenvolvimento e desafios graduais.' },
      { archetype: Archetype.MIRROR, behaviorPattern: 'Motivação dependente de reconhecimento ou cobrança externa. Pode iniciar hábitos espontaneamente, mas perde foco sem feedback ou acompanhamento social.', habitImpact: 'Progressos flutuantes; propenso a desistência se o ambiente não oferece incentivo.', interventionTips: 'Forneça feedback frequente, acompanhamento social ou mentorias. Utilize micro-recompensas externas e desafios em grupo para aumentar engajamento e responsabilidade.' },
      { archetype: Archetype.MAZE, behaviorPattern: 'Baixa motivação geral; dificuldade em iniciar ou manter hábitos mesmo com recompensas. Tendência a procrastinar e ceder à distração.', habitImpact: 'Hábitos raramente se consolidam; progresso lento ou irregular, alto risco de desistência.', interventionTips: 'Combine pequenas recompensas imediatas, monitoramento constante, reforço visual de progresso e micro-passos diários. Trabalhe para aumentar consciência do propósito e criar hábitos de baixo esforço inicial.' },
    ],
  },
  {
    id: 'autossabotagem',
    title: 'Teste de Autossabotagem',
    icon: ShieldQuestion,
    archetypes: [Archetype.BUILDER, Archetype.WARRIOR, Archetype.SHADOW],
    questions: [
        { id: 1, text: 'Quando você quer mudar algo, você:', answers: [
            { text: 'Mantém esforço consistente', archetype: Archetype.BUILDER },
            { text: 'Começa, mas logo desanima', archetype: Archetype.WARRIOR },
            { text: 'Frequentemente se boicota sem perceber', archetype: Archetype.SHADOW },
        ]},
        { id: 2, text: 'Suas falhas costumam ocorrer mais por:', answers: [
            { text: 'Fatores externos pontuais', archetype: Archetype.BUILDER },
            { text: 'Ansiedade ou medo', archetype: Archetype.WARRIOR },
            { text: 'Padrão repetitivo sem causa aparente', archetype: Archetype.SHADOW },
        ]},
        { id: 3, text: 'Quando recebe feedback, você:', answers: [
            { text: 'Usa construtivamente', archetype: Archetype.BUILDER },
            { text: 'Fica inseguro, mas tenta melhorar', archetype: Archetype.WARRIOR },
            { text: 'Ignora ou reage mal', archetype: Archetype.SHADOW },
        ]},
        { id: 4, text: 'Ao enfrentar sucesso, você:', answers: [
            { text: 'Aproveita e celebra', archetype: Archetype.BUILDER },
            { text: 'Sente desconforto ou culpa', archetype: Archetype.WARRIOR },
            { text: 'Evita ou sabota', archetype: Archetype.SHADOW },
        ]},
        { id: 5, text: 'Seus hábitos falham mais quando:', answers: [
            { text: 'Está cansado', archetype: Archetype.BUILDER },
            { text: 'Está ansioso ou estressado', archetype: Archetype.WARRIOR },
            { text: 'Sem motivo claro, padrão repetitivo', archetype: Archetype.SHADOW },
        ]},
        { id: 6, text: 'Você percebe algum padrão em suas recaídas?', answers: [
            { text: 'Sim, consciente', archetype: Archetype.BUILDER },
            { text: 'Às vezes', archetype: Archetype.WARRIOR },
            { text: 'Não, parece aleatório', archetype: Archetype.SHADOW },
        ]},
        { id: 7, text: 'Quando tenta mudar algo importante, você sente:', answers: [
            { text: 'Confiança', archetype: Archetype.BUILDER },
            { text: 'Medo de fracassar', archetype: Archetype.WARRIOR },
            { text: 'Resistência inconsciente', archetype: Archetype.SHADOW },
        ]},
        { id: 8, text: 'Você se permite recompensas quando atinge metas?', answers: [
            { text: 'Sim, saudável', archetype: Archetype.BUILDER },
            { text: 'Às vezes, com culpa', archetype: Archetype.WARRIOR },
            { text: 'Evita ou sabota recompensas', archetype: Archetype.SHADOW },
        ]},
        { id: 9, text: 'Seus hábitos passados mostram:', answers: [
            { text: 'Evolução gradual', archetype: Archetype.BUILDER },
            { text: 'Ciclos de tentativa e desistência', archetype: Archetype.WARRIOR },
            { text: 'Padrão repetitivo de autossabotagem', archetype: Archetype.SHADOW },
        ]},
        { id: 10, text: 'Se pudesse dar um conselho a você mesmo, seria:', answers: [
            { text: '“Continue tentando”', archetype: Archetype.BUILDER },
            { text: '“Cuidado com ansiedade e medo”', archetype: Archetype.WARRIOR },
            { text: '“Observe seus padrões antes de agir”', archetype: Archetype.SHADOW },
        ]},
    ],
    results: [
      { archetype: Archetype.BUILDER, behaviorPattern: 'Reconhece padrões de comportamento e falhas pontuais, reflete sobre erros e ajustes necessários. Consegue retomar hábitos após pequenas recaídas.', habitImpact: 'Evolução gradual e sustentável; consciência ajuda a prevenir sabotagem repetitiva.', interventionTips: 'Continue auto-observação diária, journaling e reforço positivo. Estabeleça metas graduais e revisões semanais para identificar e ajustar padrões emergentes.' },
      { archetype: Archetype.WARRIOR, behaviorPattern: 'Tenta manter hábitos, mas ansiedade, autocrítica ou medo do fracasso geram sabotagem frequente. Tem força de vontade, mas o estresse interno atrapalha execução.', habitImpact: 'Ciclos de tentativa e desistência; falhas aumentam a ansiedade e reforçam o medo.', interventionTips: 'Técnicas de gestão de ansiedade (respiração, mindfulness), micro-hábitos, reforço de conquistas pequenas e planejamento de contingência. Ajuda externa ou acompanhamento pode aumentar consistência.' },
      { archetype: Archetype.SHADOW, behaviorPattern: 'Recaídas recorrentes sem percepção clara do padrão. Há resistência inconsciente à mudança, autossabotagem e comportamentos autodestrutivos sutis.', habitImpact: 'Dificuldade crônica em manter hábitos; avanços irregulares e frustração constante.', interventionTips: 'Registro detalhado de check-ins, análise guiada dos gatilhos de sabotagem, micro-passos diários e reforço externo estruturado. Trabalho psicanalítico ou terapêutico profundo ajuda a identificar conflitos inconscientes que bloqueiam mudança.' },
    ],
  },
];
