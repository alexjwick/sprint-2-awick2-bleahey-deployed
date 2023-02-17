/**
 * A 2D array mocking the parsed data from band.csv
 */
const band = [
  ["firstname", "lastname", "instrument"],
  ["Giustina", "Burkle", "electric guitar"],
  ["Corry", "Marisa", "drums"],
  ["Benita", "Sikorski", "keyboard"],
  ["Merrie", "Gunn", "bass guitar"],
  ["Abbie", "Capello", "electric guitar"],
];

/**
 * Mocks searching parsed data (works only for parsed data from band.csv)
 *
 * @param parsedData data to be searched (won't work unless parsed from band.csv)
 * @param column column to search (won't work unless it's a column in band.csv)
 * @param value value to search for (won't work if it's not a value in band.csv)
 * @returns
 */
function search(parsedData: string[][], column: string, value: string) {
  if (parsedData.toString() === band.toString()) {
    //exhaustive list of cases for band.csv rows
    switch (column) {
      case "firstname" || 0:
        switch (value) {
          case "Giustina":
            return [["Giustina", "Burkle", "electric guitar"]];
          case "Corry":
            return [["Corry", "Marisa", "drums"]];
          case "Benita":
            return [["Benita", "Sikorski", "keyboard"]];
          case "Merrie":
            return [["Merrie", "Gunn", "bass guitar"]];
          case "Abbie":
            return [["Abbie", "Capello", "electric guitar"]];
          default:
            return [];
        }
      case "lastname" || 1:
        switch (value) {
          case "Burkle":
            return [["Giustina", "Burkle", "electric guitar"]];
          case "Marisa":
            return [["Corry", "Marisa", "drums"]];
          case "Sikorski":
            return [["Benita", "Sikorski", "keyboard"]];
          case "Gunn":
            return [["Merrie", "Gunn", "bass guitar"]];
          case "Capello":
            return [["Abbie", "Capello", "electric guitar"]];
          default:
            return [];
        }
      case "instrument" || 2:
        switch (value) {
          case "electric guitar":
            return [["Giustina", "Burkle", "electric guitar"]];
          case "drums":
            return [["Corry", "Marisa", "drums"]];
          case "keyboard":
            return [["Benita", "Sikorski", "keyboard"]];
          case "bass guitar":
            return [["Merrie", "Gunn", "bass guitar"]];
          case "electric guitar":
            return [["Abbie", "Capello", "electric guitar"]];
          default:
            return [];
        }
      default:
        return [];
    }
  } else {
    //safety case for bad mocking (bullying, if you will)
    console.log("Parsed data does not match mock data");
    return [];
  }
}

export { search };
