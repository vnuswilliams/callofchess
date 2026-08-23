import { Chess } from "chess.js";

type Case = {
  number: number;
  motif: string;
  fen: string;
  from: string;
  to: string;
  expectedSan: string;
  hint: string;
};

const cases: Case[] = [
  { number: 1, motif: "Attaque double", fen: "4k3/8/8/8/8/8/3N4/4K3 w - - 0 1", from: "d2", to: "e4", expectedSan: "Ne4+", hint: "Cherche un coup qui attaque deux cibles en même temps." },
  { number: 2, motif: "Fourchette", fen: "4k3/8/8/8/8/3p4/4N3/4K3 w - - 0 1", from: "e2", to: "c7", expectedSan: "Nc7+", hint: "Le cavalier peut-il attaquer le roi et une autre pièce ?" },
  { number: 3, motif: "Clouage", fen: "4r1k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1", from: "e1", to: "e8", expectedSan: "Re8#", hint: "Une pièce est-elle immobilisée parce que le roi se trouve derrière elle ?" },
  { number: 4, motif: "Enfilade", fen: "4r1k1/8/8/8/8/8/4R3/4K3 w - - 0 1", from: "e2", to: "e8", expectedSan: "Re8+", hint: "Si tu attaques la pièce la plus importante, que devra faire la pièce derrière elle ?" },
  { number: 5, motif: "Attaque à la découverte", fen: "4k3/8/8/8/3B4/8/3R4/4K3 w - - 0 1", from: "d3", to: "d8", expectedSan: "Rd8+", hint: "Déplace la pièce qui bloque ta ligne d’attaque." },
  { number: 6, motif: "Échec à la découverte", fen: "4k3/8/8/8/3B4/8/3R4/4K3 w - - 0 1", from: "d3", to: "d8", expectedSan: "Rd8+", hint: "Ton déplacement peut-il libérer une attaque contre le roi ?" },
  { number: 7, motif: "Échec double", fen: "4k3/8/8/8/3B4/8/3N4/4K3 w - - 0 1", from: "d3", to: "d5", expectedSan: "Nd5+", hint: "Existe-t-il un coup qui donne échec avec deux pièces simultanément ?" },
  { number: 8, motif: "Déviation", fen: "4k3/8/8/8/8/2R5/4r3/4K3 w - - 0 1", from: "c3", to: "c8", expectedSan: "Rc8+", hint: "Peux-tu forcer le défenseur à quitter sa case ?" },
  { number: 9, motif: "Attraction", fen: "4k3/8/8/8/8/2R5/4q3/4K3 w - - 0 1", from: "c3", to: "c8", expectedSan: "Rc8+", hint: "Peux-tu attirer une pièce ennemie sur une case vulnérable ?" },
  { number: 10, motif: "Surcharge", fen: "4k3/8/8/8/8/2R5/4r3/4K3 w - - 0 1", from: "c3", to: "c8", expectedSan: "Rc8+", hint: "Une pièce ennemie défend-elle trop de choses à la fois ?" },
  { number: 11, motif: "Élimination du défenseur", fen: "4k3/8/8/8/8/2R5/4r3/4K3 w - - 0 1", from: "c3", to: "e1", expectedSan: "Rxe1+", hint: "Quelle pièce défend la cible ? Peux-tu d’abord la supprimer ?" },
  { number: 12, motif: "Interférence", fen: "4k3/8/8/8/8/8/2B5/4K2R w - - 0 1", from: "c2", to: "d3", expectedSan: "Bd3", hint: "Peux-tu placer une pièce entre un défenseur et sa cible ?" },
  { number: 13, motif: "Rayon X", fen: "4k3/8/8/8/8/8/4R3/4K3 w - - 0 1", from: "e2", to: "e8", expectedSan: "Re8+", hint: "Une pièce peut-elle exercer une pression à travers une autre pièce ?" },
  { number: 14, motif: "Sacrifice", fen: "4k3/8/8/8/8/8/3Q4/4K3 w - - 0 1", from: "d2", to: "d8", expectedSan: "Qd8+", hint: "Accepterais-tu de donner une pièce pour obtenir quelque chose de plus important ?" },
  { number: 15, motif: "Zwischenzug / coup intermédiaire", fen: "4k3/8/8/8/8/8/3Q4/4K3 w - - 0 1", from: "d2", to: "d8", expectedSan: "Qd8+", hint: "Avant de reprendre immédiatement, existe-t-il un coup plus fort ?" },
  { number: 16, motif: "Défense par contre-attaque", fen: "4k3/8/8/8/8/8/3Q4/4K3 w - - 0 1", from: "d2", to: "d8", expectedSan: "Qd8+", hint: "Au lieu de subir la menace, peux-tu créer une menace plus forte ?" },
];

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const square = (file: number, rank: number) => `${files[file]}${rank}`;

for (const item of cases) {
  const game = new Chess(item.fen);
  const piece = game.get(item.from as never);
  const legalMoves = game.moves({ square: item.from as never, verbose: true }) as Array<{ to: string; san: string; flags: string }>;
  const candidate = legalMoves.find((move) => move.to === item.to);
  if (!candidate) {
    console.log(JSON.stringify({ number: item.number, motif: item.motif, status: "ILLEGAL", expectedSan: item.expectedSan, piece, legalDestinations: legalMoves.map((move) => `${move.to}:${move.san}`), hint: item.hint }));
    continue;
  }
  const before = new Chess(item.fen);
  const movedPiece = before.get(item.from as never);
  const move = game.move({ from: item.from, to: item.to, promotion: "q" });
  const checked = game.isCheck();
  const attacks = [] as string[];
  for (let file = 0; file < 8; file++) {
    for (let rank = 1; rank <= 8; rank++) {
      const target = square(file, rank);
      const targetPiece = game.get(target as never);
      if (targetPiece && targetPiece.color === "b" && game.isAttacked(target as never, "w")) attacks.push(`${target}:${targetPiece.type}`);
    }
  }
  console.log(JSON.stringify({ number: item.number, motif: item.motif, status: "LEGAL", expectedSan: item.expectedSan, actualSan: move.san, sanMatches: move.san === item.expectedSan, checked, movedPiece, blackPiecesAttackedAfter: attacks, isCheckmate: game.isCheckmate(), hint: item.hint }));
}
