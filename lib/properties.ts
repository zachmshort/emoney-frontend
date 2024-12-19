export interface PropertyConfig {
  name: string;
  group: string;
  position: number;
  price: number;
  rentPrices: number[];
  houseCost?: number; // Optional since utilities/railroads don't have houses
  mortgageValue: number;
  images: string[];
}
export const DefaultProperties: PropertyConfig[] = [
  // Brown properties
  {
    name: "Mediterranean Avenue",
    group: "brown",
    position: 1,
    price: 60,
    rentPrices: [2, 10, 30, 90, 160, 250],
    houseCost: 50,
    mortgageValue: 30,
    images: ["mediterranean-avenue-front"],
  },
  {
    name: "Baltic Avenue",
    group: "brown",
    position: 3,
    price: 60,
    rentPrices: [4, 20, 60, 180, 320, 450],
    houseCost: 50,
    mortgageValue: 30,
    images: ["baltic-avenue-front"],
  },

  // Light Blue properties
  {
    name: "Oriental Avenue",
    group: "light-blue",
    position: 6,
    price: 100,
    rentPrices: [6, 30, 90, 270, 400, 550],
    houseCost: 50,
    mortgageValue: 50,
    images: ["oriental-avenue-front"],
  },
  {
    name: "Vermont Avenue",
    group: "light-blue",
    position: 8,
    price: 100,
    rentPrices: [6, 30, 90, 270, 400, 550],
    houseCost: 50,
    mortgageValue: 50,
    images: ["vermont-avenue-front"],
  },
  {
    name: "Connecticut Avenue",
    group: "light-blue",
    position: 9,
    price: 120,
    rentPrices: [8, 40, 100, 300, 450, 600],
    houseCost: 50,
    mortgageValue: 60,
    images: ["connecticut-avenue-front"],
  },

  // Pink properties
  {
    name: "St. Charles Place",
    group: "pink",
    position: 11,
    price: 140,
    rentPrices: [10, 50, 150, 450, 625, 750],
    houseCost: 100,
    mortgageValue: 70,
    images: ["st-charles-place-front"],
  },
  {
    name: "States Avenue",
    group: "pink",
    position: 13,
    price: 140,
    rentPrices: [10, 50, 150, 450, 625, 750],
    houseCost: 100,
    mortgageValue: 70,
    images: ["states-avenue-front"],
  },
  {
    name: "Virginia Avenue",
    group: "pink",
    position: 14,
    price: 160,
    rentPrices: [12, 60, 180, 500, 700, 900],
    houseCost: 100,
    mortgageValue: 80,
    images: ["virginia-avenue-front"],
  },

  // Orange properties
  {
    name: "St. James Place",
    group: "orange",
    position: 16,
    price: 180,
    rentPrices: [14, 70, 200, 550, 750, 950],
    houseCost: 100,
    mortgageValue: 90,
    images: ["st-james-place-front"],
  },
  {
    name: "Tennessee Avenue",
    group: "orange",
    position: 18,
    price: 180,
    rentPrices: [14, 70, 200, 550, 750, 950],
    houseCost: 100,
    mortgageValue: 90,
    images: ["tennessee-avenue-front"],
  },
  {
    name: "New York Avenue",
    group: "orange",
    position: 19,
    price: 200,
    rentPrices: [16, 80, 220, 600, 800, 1000],
    houseCost: 100,
    mortgageValue: 100,
    images: ["new-york-avenue-front"],
  },

  // Red properties
  {
    name: "Kentucky Avenue",
    group: "red",
    position: 21,
    price: 220,
    rentPrices: [18, 90, 250, 700, 875, 1050],
    houseCost: 150,
    mortgageValue: 110,
    images: ["kentucky-avenue-front"],
  },
  {
    name: "Indiana Avenue",
    group: "red",
    position: 23,
    price: 220,
    rentPrices: [18, 90, 250, 700, 875, 1050],
    houseCost: 150,
    mortgageValue: 110,
    images: ["indiana-avenue-front"],
  },
  {
    name: "Illinois Avenue",
    group: "red",
    position: 24,
    price: 240,
    rentPrices: [20, 100, 300, 750, 925, 1100],
    houseCost: 150,
    mortgageValue: 120,
    images: ["illinois-avenue-front"],
  },

  // Yellow properties
  {
    name: "Atlantic Avenue",
    group: "yellow",
    position: 26,
    price: 260,
    rentPrices: [22, 110, 330, 800, 975, 1150],
    houseCost: 150,
    mortgageValue: 130,
    images: ["atlantic-avenue-front"],
  },
  {
    name: "Ventnor Avenue",
    group: "yellow",
    position: 27,
    price: 260,
    rentPrices: [22, 110, 330, 800, 975, 1150],
    houseCost: 150,
    mortgageValue: 130,
    images: ["ventnor-avenue-front"],
  },
  {
    name: "Marvin Gardens",
    group: "yellow",
    position: 29,
    price: 280,
    rentPrices: [24, 120, 360, 850, 1025, 1200],
    houseCost: 150,
    mortgageValue: 140,
    images: ["marvin-gardens-front"],
  },

  // Green properties
  {
    name: "Pacific Avenue",
    group: "green",
    position: 31,
    price: 300,
    rentPrices: [26, 130, 390, 900, 1100, 1275],
    houseCost: 200,
    mortgageValue: 150,
    images: ["pacific-avenue-front"],
  },
  {
    name: "North Carolina Avenue",
    group: "green",
    position: 32,
    price: 300,
    rentPrices: [26, 130, 390, 900, 1100, 1275],
    houseCost: 200,
    mortgageValue: 150,
    images: ["north-carolina-avenue-front"],
  },
  {
    name: "Pennsylvania Avenue",
    group: "green",
    position: 34,
    price: 320,
    rentPrices: [28, 150, 450, 1000, 1200, 1400],
    houseCost: 200,
    mortgageValue: 160,
    images: ["pennsylvania-avenue-front"],
  },

  // Dark Blue properties
  {
    name: "Park Place",
    group: "dark-blue",
    position: 37,
    price: 350,
    rentPrices: [35, 175, 500, 1100, 1300, 1500],
    houseCost: 200,
    mortgageValue: 175,
    images: ["park-place-front"],
  },
  {
    name: "Boardwalk",
    group: "dark-blue",
    position: 39,
    price: 400,
    rentPrices: [50, 200, 600, 1400, 1700, 2000],
    houseCost: 200,
    mortgageValue: 200,
    images: ["boardwalk-front"],
  },

  // Railroads
  {
    name: "Reading Railroad",
    group: "railroad",
    position: 5,
    price: 200,
    rentPrices: [25, 50, 100, 200],
    mortgageValue: 100,
    images: ["reading-railroad-front"],
  },
  {
    name: "Pennsylvania Railroad",
    group: "railroad",
    position: 15,
    price: 200,
    rentPrices: [25, 50, 100, 200],
    mortgageValue: 100,
    images: ["pennsylvania-railroad-front"],
  },
  {
    name: "B. & O. Railroad",
    group: "railroad",
    position: 25,
    price: 200,
    rentPrices: [25, 50, 100, 200],
    mortgageValue: 100,
    images: ["b-o-railroad-front"],
  },
  {
    name: "Short Line",
    group: "railroad",
    position: 35,
    price: 200,
    rentPrices: [25, 50, 100, 200],
    mortgageValue: 100,
    images: ["short-line-railroad-front"],
  },

  // Utilities
  {
    name: "Electric Company",
    group: "utility",
    position: 12,
    price: 150,
    rentPrices: [4, 10],
    mortgageValue: 75,
    images: ["electric-company-front"],
  },
  {
    name: "Water Works",
    group: "utility",
    position: 28,
    price: 150,
    rentPrices: [4, 10],
    mortgageValue: 75,
    images: ["water-works-front"],
  },
];
export const getPropertyByIndex = (index: number): PropertyConfig => {
  return DefaultProperties[index];
};

export const getPropertiesByGroup = (group: string): PropertyConfig[] => {
  return DefaultProperties.filter((prop) => prop.group === group);
};
