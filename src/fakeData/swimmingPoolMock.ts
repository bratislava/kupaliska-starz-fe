export interface SwimmingPool {
  name: string;
  imgSrc: string;
  description: string;
  expandedDescription: string;
  openingHours: string[];
  facilities: string[]; // "changing-room, showers, food, playground, sports, parking"
  waterTemp: number;
}

export const swimmingPools: SwimmingPool[] = [
  {
    name: "Delfín",
    imgSrc: "kupalisko-delfin.png",
    description:
      "Kúpalisko Delfín nájdete priamo v centre Ružinova, kde na vás čaká nový tobogán - kamikadze.",
    expandedDescription:
      "Kúpalisko Delfín nájdete priamo v centre Ružinova, kde na vás čaká nový tobogán - kamikadze. Okrem toho máte k dispozícii tri bazény a štandardné vybavenie ako bazény, sprchy, šatne a sauny.",
    openingHours: [
      "2.7. - 11.8.   denne 9:00 - 20:00",
      "12.8. - 1.9.   denne 9:00 - 19:00",
    ],
    facilities: ["shower", "changing-room", "food", "playground"],
    waterTemp: 22,
  },
  {
    name: "Zlaté piesky",
    imgSrc: "kupalisko-zlate_piesky.png",
    description:
      "Jazero Zlaté Piesky patrí medzi najobľúbenejšie rekreačné areály v okolí.",
    expandedDescription:
      "Jazero Zlaté Piesky patrí medzi najobľúbenejšie rekreačné areály v okolí. Okrem príjemného prostredia ponúka aj prístup k tobogánu, požičovňu vodných plavidiel, športové aj detské ihriská. Výhodou je aj možnosť ubytovania a stravovania počas dlhých letných večerov.",
    openingHours: [
      "2.7. - 11.8.   denne 9:00 - 20:00",
      "12.8. - 1.9.   denne 9:00 - 19:00",
    ],
    facilities: [
      "shower",
      "changing-room",
      "food",
      "playground",
      "volleyball",
      "football",
      "parking",
      "accommodation",
    ],
    waterTemp: 22,
  },
  {
    name: "Tehelné pole",
    imgSrc: "kupalisko-tehelne_pole.png",
    description:
      "Počas letnej sezóny určite nevynechajte návštevu kúpaliska Tehelné pole. Patrí k jednému z najkrajších a najznámejších bratislavských areálov.",
    expandedDescription:
      "Počas letnej sezóny určite nevynechajte návštevu kúpaliska Tehelné pole. Patrí k jednému z najkrajších a najznámejších bratislavských areálov. K dispozícii máte tri vonkajšie bazény, vrátane plaveckého aj detského. Nechýba ani možnosť zapožičania lehátok.",
    openingHours: [
      "2.7. - 11.8.   denne 9:00 - 20:00",
      "12.8. - 1.9.   denne 9:00 - 19:00",
    ],
    facilities: ["shower", "changing-room", "food", "playground", "parking"],
    waterTemp: 22,
  },
  {
    name: "Rosnička",
    imgSrc: "kupalisko-rosnicka.png",
    description:
      "Krásne prostredie okolitých lesov dotvára príjemnú atmosféru areálu Rosnička, ktoré sa nachádza medzi mestskými časťami Dúbravka a Karlova Ves.",
    expandedDescription:
      "Krásne prostredie okolitých lesov dotvára príjemnú atmosféru areálu Rosnička, ktoré sa nachádza medzi mestskými časťami Dúbravka a Karlova Ves. Najmä tých najmenších poteší trojdráhová šmykľavka, detské a beachvolejbalové ihrisko.",
    openingHours: [
      "2.7. - 11.8.   denne 9:00 - 20:00",
      "12.8. - 1.9.   denne 9:00 - 19:00",
    ],
    facilities: [
      "shower",
      "changing-room",
      "food",
      "playground",
      "volleyball",
      "parking",
    ],
    waterTemp: 22,
  },
  {
    name: "Krasňany",
    imgSrc: "kupalisko-krasnany.png",
    description:
      "Letné kúpalisko Krasňany disponuje dvoma bazénmi - plaveckým a detským.",
    expandedDescription:
      "Letné kúpalisko Krasňany disponuje dvoma bazénmi - plaveckým a detským. Okrem toho tu nájdete aj štandardnú výbavu ako sú šatne, bufet, či detské ihrisko. ",
    openingHours: [
      "2.7. - 11.8.   denne 9:00 - 20:00",
      "12.8. - 1.9.   denne 9:00 - 19:00",
    ],
    facilities: ["changing-room", "food", "playground"],
    waterTemp: 22,
  },
];
