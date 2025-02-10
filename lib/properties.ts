export interface PropertyConfig {
  name: string;
  group: string;
  position: number;
  color: string;
  price: number;
  rentPrices: number[];
  houseCost?: number;
  mortgageValue: number;
}

export const DefaultProperties: PropertyConfig[] = [
  // Brown properties
  {
    name: "Mediterranean Avenue",
    group: "brown",
    color: "#955436",
    position: 1,
    price: 60,
    rentPrices: [2, 10, 30, 90, 160, 250],
    houseCost: 50,
    mortgageValue: 30,
  },
  {
    name: "Baltic Avenue",
    group: "brown",
    color: "#955436",
    position: 3,
    price: 60,
    rentPrices: [4, 20, 60, 180, 320, 450],
    houseCost: 50,
    mortgageValue: 30,
  },

  // Light Blue properties
  {
    name: "Oriental Avenue",
    group: "light-blue",
    color: "#AAE6E6",
    position: 6,
    price: 100,
    rentPrices: [6, 30, 90, 270, 400, 550],
    houseCost: 50,
    mortgageValue: 50,
  },
  {
    name: "Vermont Avenue",
    group: "light-blue",
    color: "#AAE6E6",
    position: 8,
    price: 100,
    rentPrices: [6, 30, 90, 270, 400, 550],
    houseCost: 50,
    mortgageValue: 50,
  },
  {
    name: "Connecticut Avenue",
    group: "light-blue",
    color: "#AAE6E6",
    position: 9,
    price: 120,
    rentPrices: [8, 40, 100, 300, 450, 600],
    houseCost: 50,
    mortgageValue: 60,
  },

  // Pink properties
  {
    name: "St. Charles Place",
    group: "pink",
    color: "#D93A96",
    position: 11,
    price: 140,
    rentPrices: [10, 50, 150, 450, 625, 750],
    houseCost: 100,
    mortgageValue: 70,
  },
  {
    name: "States Avenue",
    group: "pink",
    color: "#D93A96",
    position: 13,
    price: 140,
    rentPrices: [10, 50, 150, 450, 625, 750],
    houseCost: 100,
    mortgageValue: 70,
  },
  {
    name: "Virginia Avenue",
    group: "pink",
    color: "#D93A96",
    position: 14,
    price: 160,
    rentPrices: [12, 60, 180, 500, 700, 900],
    houseCost: 100,
    mortgageValue: 80,
  },

  // Orange properties
  {
    name: "St. James Place",
    group: "orange",
    color: "#F7921E",
    position: 16,
    price: 180,
    rentPrices: [14, 70, 200, 550, 750, 950],
    houseCost: 100,
    mortgageValue: 90,
  },
  {
    name: "Tennessee Avenue",
    group: "orange",
    color: "#F7921E",
    position: 18,
    price: 180,
    rentPrices: [14, 70, 200, 550, 750, 950],
    houseCost: 100,
    mortgageValue: 90,
  },
  {
    name: "New York Avenue",
    group: "orange",
    color: "#F7921E",
    position: 19,
    price: 200,
    rentPrices: [16, 80, 220, 600, 800, 1000],
    houseCost: 100,
    mortgageValue: 100,
  },

  // Red properties
  {
    name: "Kentucky Avenue",
    group: "red",
    color: "#ED1B24",
    position: 21,
    price: 220,
    rentPrices: [18, 90, 250, 700, 875, 1050],
    houseCost: 150,
    mortgageValue: 110,
  },
  {
    name: "Indiana Avenue",
    group: "red",
    color: "#ED1B24",
    position: 23,
    price: 220,
    rentPrices: [18, 90, 250, 700, 875, 1050],
    houseCost: 150,
    mortgageValue: 110,
  },
  {
    name: "Illinois Avenue",
    group: "red",
    color: "#ED1B24",
    position: 24,
    price: 240,
    rentPrices: [20, 100, 300, 750, 925, 1100],
    houseCost: 150,
    mortgageValue: 120,
  },

  // Yellow properties
  {
    name: "Atlantic Avenue",
    group: "yellow",
    color: "#FEF200",
    position: 26,
    price: 260,
    rentPrices: [22, 110, 330, 800, 975, 1150],
    houseCost: 150,
    mortgageValue: 130,
  },
  {
    name: "Ventnor Avenue",
    group: "yellow",
    color: "#FEF200",
    position: 27,
    price: 260,
    rentPrices: [22, 110, 330, 800, 975, 1150],
    houseCost: 150,
    mortgageValue: 130,
  },
  {
    name: "Marvin Gardens",
    group: "yellow",
    color: "#FEF200",
    position: 29,
    price: 280,
    rentPrices: [24, 120, 360, 850, 1025, 1200],
    houseCost: 150,
    mortgageValue: 140,
  },

  // Green properties
  {
    name: "Pacific Avenue",
    group: "green",
    color: "#1FB25A",
    position: 31,
    price: 300,
    rentPrices: [26, 130, 390, 900, 1100, 1275],
    houseCost: 200,
    mortgageValue: 150,
  },
  {
    name: "North Carolina Avenue",
    group: "green",
    color: "#1FB25A",
    position: 32,
    price: 300,
    rentPrices: [26, 130, 390, 900, 1100, 1275],
    houseCost: 200,
    mortgageValue: 150,
  },
  {
    name: "Pennsylvania Avenue",
    group: "green",
    color: "#1FB25A",
    position: 34,
    price: 320,
    rentPrices: [28, 150, 450, 1000, 1200, 1400],
    houseCost: 200,
    mortgageValue: 160,
  },

  // Dark Blue properties
  {
    name: "Park Place",
    group: "dark-blue",
    color: "#0072BB",
    position: 37,
    price: 350,
    rentPrices: [35, 175, 500, 1100, 1300, 1500],
    houseCost: 200,
    mortgageValue: 175,
  },
  {
    name: "Boardwalk",
    group: "dark-blue",
    color: "#0072BB",
    position: 39,
    price: 400,
    rentPrices: [50, 200, 600, 1400, 1700, 2000],
    houseCost: 200,
    mortgageValue: 200,
  },

  // Railroads
  {
    name: "Reading Railroad",
    group: "railroad",
    color: "#000000",
    position: 5,
    price: 200,
    rentPrices: [25, 50, 100, 200],
    mortgageValue: 100,
  },
  {
    name: "Pennsylvania Railroad",
    group: "railroad",
    color: "#000000",
    position: 15,
    price: 200,
    rentPrices: [25, 50, 100, 200],
    mortgageValue: 100,
  },
  {
    name: "B. & O. Railroad",
    group: "railroad",
    color: "#000000",
    position: 25,
    price: 200,
    rentPrices: [25, 50, 100, 200],
    mortgageValue: 100,
  },
  {
    name: "Short Line",
    group: "railroad",
    color: "#000000",
    position: 35,
    price: 200,
    rentPrices: [25, 50, 100, 200],
    mortgageValue: 100,
  },

  // Utilities
  {
    name: "Electric Company",
    group: "utility",
    color: "#959595",
    position: 12,
    price: 150,
    rentPrices: [4, 10],
    mortgageValue: 75,
  },
  {
    name: "Water Works",
    group: "utility",
    color: "#959595",
    position: 28,
    price: 150,
    rentPrices: [4, 10],
    mortgageValue: 75,
  },
];
export const getPropertyByIndex = (index: number): PropertyConfig => {
  return DefaultProperties[index];
};

export const getPropertiesByGroup = (group: string): PropertyConfig[] => {
  return DefaultProperties.filter((prop) => prop.group === group);
};
