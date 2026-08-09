/**
 * CONFIG DA RÁDIO — é só esse arquivo que você precisa mexer.
 *
 * Cada estação é uma pasta dentro de src/assets/radio/<pasta>/.
 * As músicas de cada pasta são descobertas AUTOMATICAMENTE — não
 * precisa importar nem listar arquivo nenhum aqui. É só jogar o
 * .mp3 dentro da pasta certa e ele já aparece na rádio.
 *
 * Não existe limite de quantidade de músicas por estação no
 * código — pode ter 1, 10, 30, tanto faz. O player já tem botões
 * de pular pra próxima/anterior faixa e mostra "Faixa X de Y"
 * automaticamente, e as faixas tocam em sequência sozinhas (ao
 * acabar uma, já pula pra próxima).
 *
 * PRA ADICIONAR UMA MÚSICA NOVA a uma estação que já existe:
 *   1. Solte o arquivo .mp3 dentro de src/assets/radio/<pasta-da-estacao>/
 *   2. (Opcional, mas recomendado) Adicione o título/artista dela
 *      em TRACK_METADATA abaixo, usando o NOME EXATO do arquivo
 *      como chave — assim o nome certo aparece no player em vez
 *      do nome cru do arquivo.
 *
 * PRA CRIAR UMA ESTAÇÃO NOVA:
 *   1. Crie uma pasta nova em src/assets/radio/ (ex: "brodi-fm")
 *   2. Coloque pelo menos um .mp3 dentro dela
 *   3. Adicione uma entrada no array STATIONS_CONFIG abaixo, com o
 *      "folder" batendo EXATAMENTE com o nome da pasta que você criou
 *
 * Pastas sem nenhum .mp3 dentro são ignoradas automaticamente (não
 * aparecem na rádio, não quebram nada).
 */
export const STATIONS_CONFIG = [
  { folder: 'los-brodis', name: 'LOS BRODIS', genre: 'LOS BRODIS' },
  { folder: 'radio-caos', name: 'RÁDIO CAOS GTB', genre: 'ROCK & CAOS' },
  { folder: 'samura-fm', name: 'SAMURA FM', genre: 'ESPECIAL SAMURA' },
  // Pra adicionar uma rádio nova, copie a linha de cima e ajuste:
  // { folder: 'brodi-fm', name: 'BRODI FM', genre: 'CLÁSSICOS' },
]

/**
 * TÍTULO E ARTISTA DE CADA FAIXA (edição manual)
 * -------------------------------------------------------------
 * A chave é o NOME EXATO do arquivo .mp3 (com extensão, sem o
 * caminho da pasta). Se uma faixa não estiver aqui, o player usa
 * o nome do arquivo cru como veio (com underscore e tudo) — não
 * quebra nada, só fica menos bonito até você preencher.
 *
 * Exemplo de como preencher uma faixa nova:
 *   'nome-do-arquivo.mp3': { title: 'Nome da Música', artist: 'Quem Fez' },
 */
export const TRACK_METADATA = {
  'Na_quatro_por_merda.mp3': { title: 'Na Quatro Por Merda', artist: 'Los Brodis' },
  'The_Hungry_Trombone.mp3': { title: 'The Hungry Trombone', artist: 'Rádio Caos GTB' },
  'Maconha_Do_Samura.mp3': { title: 'Maconha Do Samura', artist: 'Samura FM' },
}

/**
 * ANÚNCIOS DA RÁDIO (opcional)
 * -------------------------------------------------------------
 * Um "anúncio" é um arquivo de áudio curto (alguém falando sobre
 * uma marca ou algo do universo do GTB) que toca DE VEZ EM QUANDO
 * entre as músicas de uma estação — igual rádio de verdade.
 *
 * Cada estação pode ter sua própria lista de anúncios, ou nenhuma
 * (se o array `ads` não existir ou estiver vazio, a estação toca
 * só música, sem interrupção nenhuma — comportamento de hoje).
 *
 * PRA ADICIONAR UM ANÚNCIO:
 *   1. Salve o arquivo .mp3 em src/assets/radio-ads/
 *      (pasta separada das músicas, pra não confundir os dois)
 *   2. Importe ele aqui embaixo
 *   3. Adicione na lista `ads` da estação onde ele deve tocar
 *
 * `frequency` controla a chance de um anúncio tocar depois de cada
 * música — é a probabilidade de 0 a 1 (ex: 0.25 = 25% de chance a
 * cada faixa que termina). Ajuste esse número se quiser anúncio
 * mais raro (número menor) ou mais frequente (número maior).
 */
export const AD_FREQUENCY = 0.25

// Exemplo de como registrar anúncios (deixe comentado até você ter
// os arquivos de áudio prontos — sem isso, nenhum anúncio toca,
// sem quebrar nada):
//
// import fotafoxBurgerAd from '../assets/radio-ads/fotafox-burger-ad.mp3'
//
// export const STATION_ADS = {
//   'los-brodis': [
//     { file: fotafoxBurgerAd, label: 'Publicidade — Fotafox Burger' },
//   ],
// }
export const STATION_ADS = {}
