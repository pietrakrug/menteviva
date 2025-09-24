
import { TipCategory } from '../types';
import { Lightbulb, Moon, BrainCog } from 'lucide-react';

export const TIPS_DATA: TipCategory[] = [
    {
        id: 'habits',
        title: 'Criação de Hábitos',
        icon: Lightbulb,
        tips: [
            {
                title: 'A Regra dos 2 Minutos',
                content: 'Quer ler mais? Comece lendo uma página por dia. Quer se exercitar? Comece colocando o tênis de corrida. A neurociência mostra que iniciar é a parte mais difícil. Reduzir o hábito a algo que leva menos de dois minutos remove a barreira inicial e cria o caminho neural para a consistência.',
            },
            {
                title: 'Empilhamento de Hábitos',
                content: 'Seu cérebro adora conexões. Em vez de criar um hábito do zero, conecte-o a um que você já tem. Exemplo: "Depois de escovar os dentes (hábito existente), vou meditar por um minuto (novo hábito)". Isso usa uma trilha neural já estabelecida como um gatilho para a nova ação.',
            },
            {
                title: 'Recompense seu Cérebro Imediatamente',
                content: 'O cérebro primitivo ama recompensas rápidas. Depois de completar seu hábito, dê a si mesmo um pequeno prazer: ouvir sua música favorita, tomar um gole de um chá gostoso, etc. Isso libera dopamina, ensinando seu cérebro que o novo hábito é algo bom e que vale a pena repetir.',
            },
        ],
    },
    {
        id: 'sleep',
        title: 'Rotina do Sono',
        icon: Moon,
        tips: [
            {
                title: 'O Poder da Escuridão',
                content: 'A luz azul de telas (celular, TV) engana seu cérebro, fazendo-o pensar que ainda é dia e inibindo a produção de melatonina, o hormônio do sono. Tente desligar as telas pelo menos uma hora antes de dormir para sinalizar ao seu corpo que é hora de descansar.',
            },
            {
                title: 'Temperatura é Chave',
                content: 'Seu corpo precisa diminuir a temperatura interna para iniciar o sono. Um banho morno antes de dormir pode ajudar: ele aumenta a temperatura corporal e, ao sair, o resfriamento rápido sinaliza ao cérebro que é hora de dormir. Manter o quarto fresco também é crucial.',
            },
            {
                title: 'Não Lute Contra a Insônia na Cama',
                content: 'Se você não conseguir dormir em 20 minutos, levante-se. A psicanálise sugere que ficar na cama frustrado cria uma associação negativa entre sua cama e a ansiedade. Vá para outro cômodo, leia um livro com luz fraca e só volte para a cama quando sentir sono novamente.',
            },
        ],
    },
    {
        id: 'focus',
        title: 'Foco e Produtividade',
        icon: BrainCog,
        tips: [
            {
                title: 'O Mito da Multitarefa',
                content: 'Seu cérebro não faz multitarefa, ele alterna rapidamente entre tarefas, o que consome energia e aumenta a chance de erros. É como usar o mesmo jogador para ser goleiro e atacante ao mesmo tempo. Para um trabalho profundo, foque em uma única coisa de cada vez.',
            },
            {
                title: 'Abrace o Tédio',
                content: 'Em um mundo de notificações constantes, nosso cérebro desaprendeu a ficar ocioso. O tédio é essencial para a criatividade e para recarregar os circuitos de atenção. Reserve pequenos momentos do dia para não fazer nada e apenas deixar sua mente vagar, sem estímulos.',
            },
            {
                title: 'Hidratação e Cérebro',
                content: 'Seu cérebro é composto por cerca de 75% de água. Uma desidratação leve já pode afetar a concentração, a memória e o humor. Ter uma garrafa de água por perto não é apenas sobre saúde física; é uma das ferramentas de produtividade mais subestimadas.',
            },
        ],
    },
];
