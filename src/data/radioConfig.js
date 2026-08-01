/**
 * CONFIG DA RÁDIO — é só esse arquivo que você precisa mexer.
 *
 * Cada estação é uma pasta dentro de src/assets/radio/<pasta>/.
 * As músicas de cada pasta são descobertas AUTOMATICAMENTE — não
 * precisa importar nem listar arquivo nenhum aqui. É só jogar o
 * .mp3 dentro da pasta certa e ele já aparece na rádio.
 *
 * PRA ADICIONAR UMA MÚSICA NOVA a uma estação que já existe:
 *   1. Solte o arquivo .mp3 dentro de src/assets/radio/<pasta-da-estacao>/
 *   2. Pronto. Não precisa editar nenhum código.
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
