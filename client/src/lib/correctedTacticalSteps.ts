export type CorrectedStepSpec = [string, string, string, string, string, string, string, string];

export const correctedTacticalSteps: Record<string, CorrectedStepSpec[]> = {
  "13": [
    ["8/8/5k2/2r5/8/8/3N4/4K3 w - - 0 1", "d2", "e4", "Ne4+", "Attaquez le roi et la tour avec le même cavalier.", "Attack the king and the rook with the same knight.", "Le cavalier e4 donne échec au roi f6 et attaque la tour c5.", "The knight on e4 checks the king on f6 and attacks the rook on c5."],
    ["8/2r1k3/8/8/8/2N5/8/4K3 w - - 0 1", "c3", "d5", "Nd5+", "Créez une double attaque sur le roi et la tour.", "Create a double attack on the king and rook.", "Depuis d5, le cavalier attaque e7 et c7.", "From d5, the knight attacks e7 and c7."],
    ["8/2q1k3/8/8/8/2N5/8/4K3 w - - 0 1", "c3", "d5", "Nd5+", "Donnez échec tout en visant une seconde cible.", "Give check while targeting a second piece.", "L’échec donne le tempo pour exploiter la seconde attaque.", "The check gives time to exploit the second attack."],
  ],
  "14": [
    ["q3k3/8/8/1N6/8/8/8/4K3 w - - 0 1", "b5", "c7", "Nc7+", "Fourchez le roi et la dame.", "Fork the king and queen.", "Le cavalier c7 attaque e8 et a8 ; le roi doit répondre avant la dame.", "The knight on c7 attacks e8 and a8; the king must answer before the queen."],
    ["8/8/8/1q3k2/8/8/2N5/4K3 w - - 0 1", "c2", "d4", "Nd4+", "Placez le cavalier sur une case qui gagne une cible.", "Place the knight on a square that wins a target.", "La fourchette se juge sur les attaques de la case d’arrivée.", "The fork is judged by the attacks from the destination square."],
    ["8/2q1k3/8/8/8/2N5/8/4K3 w - - 0 1", "c3", "d5", "Nd5+", "Cherchez la fourchette avec échec.", "Look for the checking fork.", "Après la fuite du roi, la seconde cible reste attaquée.", "After the king moves, the second target remains attacked."],
  ],
  "15": [
    ["4k3/4n3/8/8/8/8/8/4R1K1 w - - 0 1", "e1", "e7", "Rxe7+", "Exploitez le cavalier cloué devant le roi.", "Exploit the knight pinned in front of the king.", "La tour capture la pièce qui ne pouvait pas quitter la ligne du roi.", "The rook captures the piece that could not leave the king’s line."],
    ["3k4/3n4/8/8/8/8/8/3R2K1 w - - 0 1", "d1", "d7", "Rxd7+", "Ajoutez une pression sur la pièce clouée.", "Add pressure to the pinned piece.", "Le roi d8 se trouve derrière le cavalier d7.", "The king on d8 stands behind the knight on d7."],
    ["4q2k/4n3/8/8/8/8/8/4R1K1 w - - 0 1", "e1", "e7", "Rxe7", "Exploitez un clouage relatif.", "Exploit a relative pin.", "Le déplacement du cavalier abandonnerait la dame e8.", "Moving the knight would expose the queen on e8."],
  ],
  "16": [
    ["8/7r/6k1/8/8/8/8/3QK3 w - - 0 1", "d1", "h5", "Qh5+", "Enfilez le roi et la tour.", "Skewer the king and rook.", "La dame h5 attaque le roi g6 puis la tour h7 derrière lui.", "The queen on h5 attacks the king on g6 and the rook behind it on h7."],
    ["8/7q/6k1/8/8/8/8/3QK3 w - - 0 1", "d1", "h5", "Qh5+", "Enfilez le roi et la dame", "Skewer the king and queen.", "Le premier échec force le roi à bouger et découvre la dame h7.", "The first check forces the king to move and exposes the queen on h7."],
    ["8/8/8/4k2r/8/8/8/R3K3 w - - 0 1", "a1", "a5", "Ra5+", "Utilisez la rangée ouverte pour une enfilade.", "Use the open rank for a skewer.", "La tour a5 donne échec au roi e5 et attaque la tour h5.", "The rook on a5 checks the king on e5 and attacks the rook on h5."],
  ],
  "17": [
    ["q6k/8/8/8/8/8/B7/R3K3 w - - 0 1", "a2", "b3", "Bb3", "Déplacez le fou pour découvrir la tour.", "Move the bishop to reveal the rook.", "Le départ du fou ouvre la colonne a vers la dame noire a8.", "The bishop’s departure opens the a-file toward the black queen on a8."],
    ["3q3k/8/8/8/8/8/3N4/3R2K1 w - - 0 1", "d2", "c4", "Nc4", "Ouvrez la ligne de la tour vers la dame.", "Open the rook’s line toward the queen.", "Le cavalier quitte d2 et la tour d1 attaque la dame d8.", "The knight leaves d2 and the rook on d1 attacks the queen on d8."],
    ["7k/8/7q/8/8/8/3N4/2B1K3 w - - 0 1", "d2", "f3", "Nf3", "Révélez l’attaque du fou sur la diagonale.", "Reveal the bishop’s diagonal attack.", "Le fou c1 vise h6 dès que d2 est libérée.", "The bishop on c1 targets h6 once d2 is cleared."],
  ],
  "18": [
    ["k7/8/8/8/8/8/B7/R3K3 w - - 0 1", "a2", "b3", "Bb3+", "Libérez l’échec de la tour.", "Release the rook’s check.", "Le fou quitte a2 et la tour a1 donne échec au roi a8.", "The bishop leaves a2 and the rook a1 checks the king a8."],
    ["3k4/8/8/8/8/8/3N4/3R2K1 w - - 0 1", "d2", "c4", "Nc4+", "Révélez l’échec sur la colonne d.", "Reveal the check on the d-file.", "La tour d1 devient l’attaquante du roi d8.", "The rook d1 becomes the attacker of the king d8."],
    ["7k/8/8/4B3/8/8/7B/6KR w - - 0 1", "h2", "g3", "Bhg3+", "Donnez un échec à la découverte.", "Give a discovered check.", "Le fou g3 libère la tour h1 qui attaque le roi h8.", "The bishop on g3 reveals the rook h1 attacking the king h8."],
  ],
  "19": [
    ["4k3/8/8/8/8/8/4B3/4R1K1 w - - 0 1", "e2", "b5", "Bb5+", "Donnez échec avec le fou et la tour.", "Give check with the bishop and rook.", "Le fou b5 attaque e8 tandis que la tour e1 devient visible.", "The bishop b5 attacks e8 while the rook e1 becomes visible."],
    ["3k4/8/8/8/8/8/3B4/3R2K1 w - - 0 1", "d2", "a5", "Ba5+", "Ouvrez la colonne et donnez un second échec.", "Open the file and give a second check.", "Le fou a5 attaque d8 et la tour d1 attaque le roi sur la colonne.", "The bishop a5 attacks d8 and the rook d1 attacks the king along the file."],
    ["7k/8/8/8/8/8/7B/6KR w - - 0 1", "h2", "e5", "Be5+", "Trouvez le double échec de batterie.", "Find the battery double check.", "Le fou g3 libère la tour h1 et révèle le second échec.", "The bishop g3 clears the h-file and the rook h1 reveals the second check."],
  ],
  "20": [
    ["4k3/3r4/8/8/8/8/3Q4/4K3 w - - 0 1", "d2", "d7", "Qxd7+", "Détournez le défenseur par un échec.", "Deflect the defender with check.", "La prise force le roi à répondre et change la mission de la pièce qui défendait la septième rangée.", "The capture forces a reply and changes the duty of the piece defending the seventh rank."],
    ["4k3/3r3q/8/8/8/8/3Q4/4K3 w - - 0 1", "d2", "d7", "Qxd7+", "Forcez la pièce principale à quitter sa défense.", "Force the key piece away from its defense.", "Après la prise en d7, la reine h7 devient accessible sur la septième rangée.", "After the capture on d7, the queen h7 becomes accessible along the seventh rank."],
    ["4k3/3r4/8/8/8/3Q4/8/4K3 w - - 0 1", "d3", "d7", "Qxd7+", "Détournez la tour de la ligne qu’elle protège.", "Deflect the rook from the line it protects.", "L’échec impose une réponse avant le gain de la seconde cible.", "The check forces a reply before the second target is won."],
  ],
  "21": [
    ["6k1/8/8/8/8/3Q4/8/4K3 w - - 0 1", "d3", "h7", "Qh7+", "Attirez le roi sur une case vulnérable.", "Lure the king onto a vulnerable square.", "La dame h7 offre une cible au roi g8 ; la case d’arrivée doit être calculée.", "The queen on h7 offers a target to the king g8; the destination must be calculated."],
    ["6k1/8/8/8/8/3Q4/8/4K3 w - - 0 1", "d3", "h7", "Qh7+", "Forcez le roi à choisir sa case de réponse.", "Force the king to choose its reply square.", "L’attraction fonctionne lorsque la case proposée modifie les défenses du roi.", "The decoy works when the offered square changes the king’s defenses."],
    ["6k1/8/8/8/8/3Q4/8/4K3 w - - 0 1", "d3", "h7", "Qh7+", "Attirez la cible vers une ligne de prise.", "Lure the target onto a capture line.", "Avant de sacrifier, vérifiez la pièce qui exploitera la case attirée.", "Before sacrificing, check which piece will exploit the decoy square."],
  ],
  "22": [
    ["4k3/3r4/8/8/8/3Q4/8/4R2K w - - 0 1", "d3", "d7", "Qxd7+", "Exploitez une tour qui doit remplir deux missions.", "Exploit a rook with two duties.", "La tour d7 ne peut pas protéger simultanément la ligne et la cible qu’elle garde.", "The rook on d7 cannot protect both the line and the target it guards."],
    ["4k3/3r4/8/8/8/3Q4/8/4R2K w - - 0 1", "d3", "d7", "Qxd7+", "Ajoutez une seconde obligation au défenseur.", "Add a second duty to the defender.", "La prise avec échec transforme la surcharge en gain concret.", "The checking capture turns the overload into a concrete gain."],
    ["4k3/3r4/8/8/8/3Q4/8/4R2K w - - 0 1", "d3", "d7", "Qxd7+", "Calculez quelle mission le défenseur abandonne.", "Calculate which duty the defender abandons.", "Une surcharge n’existe que si les deux missions sont réellement incompatibles.", "An overload exists only when the two duties are genuinely incompatible."],
  ],
  "23": [
    ["4k3/8/8/8/8/3r4/2B5/4K3 w - - 0 1", "c2", "d3", "Bxd3", "Supprimez le défenseur de la ligne.", "Remove the defender from the line.", "Le fou se place pour attaquer la tour d7 qui protège la cible.", "The bishop places itself to attack the rook d7 protecting the target."],
    ["4k3/4r3/8/8/8/8/4Q3/4K3 w - - 0 1", "e2", "e7", "Qxe7+", "Éliminez la pièce qui protège le roi.", "Remove the piece protecting the king.", "La prise de la tour e7 ouvre la ligne vers le roi e8.", "Capturing the rook e7 opens the line toward the king e8."],
    ["4k3/3r4/8/8/8/8/3Q4/4K3 w - - 0 1", "d2", "d7", "Qxd7+", "Retirez le défenseur avant de prendre la cible.", "Remove the defender before taking the target.", "La pièce défensive est la première cible concrète de la combinaison.", "The defensive piece is the combination’s first concrete target."],
  ],
  "24": [
    ["k7/8/8/8/8/8/2B5/R3K3 w - - 0 1", "c2", "a4", "Ba4", "Coupez la ligne entre la tour et sa cible.", "Cut the line between the rook and its target.", "Le fou a4 interrompt la colonne a entre la tour noire et la tour blanche.", "The bishop a4 interrupts the a-file between the black and white rooks."],
    ["q6k/8/8/3B4/8/8/8/3R1K2 w - - 0 1", "d5", "c6", "Bc6", "Placez un obstacle sur la diagonale.", "Place an obstacle on the diagonal.", "Le fou c6 coupe la diagonale a8–h1 de la dame noire.", "The bishop c6 cuts the black queen’s a8–h1 diagonal."],
    ["6kr/8/8/8/8/8/4B3/R3K3 w - - 0 1", "e2", "a6", "Ba6", "Interrompez la communication adverse.", "Interrupt the opponent’s communication.", "La pièce intermédiaire prive la tour h8 de sa ligne vers la tour a1.", "The intermediate piece denies the rook h8 its line toward the rook a1."],
  ],
  "25": [
    ["k7/8/8/r7/8/8/8/R3K3 w - - 0 1", "a1", "a5", "Rxa5+", "Exploitez la pression à travers la tour noire.", "Exploit the pressure through the black rook.", "La tour blanche capture la pièce intermédiaire et donne échec au roi a8.", "The white rook captures the intermediate piece and checks the king a8."],
    ["8/7k/8/8/4n3/8/8/1B2K3 w - - 0 1", "b1", "e4", "Bxe4+", "Utilisez la diagonale qui traversait la pièce.", "Use the diagonal that ran through the piece.", "Le fou capture e4 et la ligne vers le roi h6 devient active.", "The bishop captures e4 and the line toward the king h6 becomes active."],
    ["3k4/3r4/8/8/8/8/8/3QK3 w - - 0 1", "d1", "d7", "Qxd7+", "Transformez la pression indirecte en prise.", "Turn indirect pressure into a capture.", "La dame traverse la colonne jusqu’à la tour d7 puis attaque le roi d8.", "The queen crosses the file to capture the rook d7 and checks the king d8."],
  ],
  "26": [
    ["6k1/8/8/8/8/3Q4/8/4K3 w - - 0 1", "d3", "h7", "Qh7+", "Donnez la dame pour ouvrir l’attaque contre le roi.", "Give the queen to open the attack on the king.", "Le sacrifice doit être évalué par la suite forcing et non par la première prise.", "The sacrifice must be evaluated by the forcing continuation, not the first capture."],
    ["8/8/6k1/8/4B3/8/8/3QK3 w - - 0 1", "d1", "h5", "Qh5+", "Sacrifiez du matériel pour gagner des temps.", "Sacrifice material to gain tempi.", "L’échec ouvre les lignes et donne la priorité à l’initiative.", "The check opens lines and gives priority to the initiative."],
    ["4k3/8/8/8/8/8/3Q4/4K3 w - - 0 1", "d2", "d8", "Qd8+", "Mesurez la compensation avant de sacrifier.", "Measure the compensation before sacrificing.", "Un sacrifice correct doit produire une compensation vérifiable.", "A sound sacrifice must produce verifiable compensation."],
  ],
  "27": [
    ["6k1/3r4/8/8/8/3Q4/2B5/3R2K1 w - - 0 1", "d3", "h7", "Qh7+", "Jouez le coup forcing avant de reprendre la tour.", "Play the forcing move before recapturing the rook.", "La prise en d7 peut attendre ; l’échec h7 impose d’abord une réponse.", "The capture on d7 can wait; the check on h7 must be answered first."],
    ["6k1/4q3/8/8/8/3Q4/8/4R2K w - - 0 1", "d3", "h7", "Qh7+", "Insérez un échec avant la reprise.", "Insert a check before recapturing.", "Le coup intermédiaire change l’ordre des coups et gagne un tempo.", "The zwischenzug changes the move order and gains a tempo."],
    ["6k1/3r4/8/8/8/3Q4/2B5/3R2K1 w - - 0 1", "d3", "h7", "Qh7+", "Ne reprenez pas automatiquement.", "Do not recapture automatically.", "Cherchez d’abord l’échec, la prise ou la menace la plus forcing.", "First search for the most forcing check, capture or threat."],
  ],
  "28": [
    ["6k1/3r4/8/8/8/3Q4/2B5/4K3 w - - 0 1", "d3", "h7", "Qh7+", "Répondez à la menace sur la dame par une contre-attaque.", "Answer the threat against the queen with a counterattack.", "La tour d7 attaque la dame d3 ; l’échec h7 crée une menace plus urgente.", "The rook d7 attacks the queen d3; the check on h7 creates a more urgent threat."],
    ["6k1/8/8/8/8/3Q4/4r3/4R2K w - - 0 1", "d3", "h7", "Qh7+", "Créez une menace plus forte que celle reçue.", "Create a stronger threat than the one received.", "La dame quitte l’attaque de la tour et donne un échec immédiat.", "The queen leaves the rook’s attack and gives immediate check."],
    ["6k1/3r4/8/8/8/3Q4/2B5/4K3 w - - 0 1", "d3", "h7", "Qh7+", "Défendez-vous activement par un échec.", "Defend actively with a check.", "Une contre-attaque réussie force l’adversaire à changer de priorité.", "A successful counterattack forces the opponent to change priorities."],
  ],
};
