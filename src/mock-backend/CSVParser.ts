function parse(filepath: string) {
  switch (filepath) {
    case "band.csv":
      return [
        ["firstname", "lastname", "instrument"],
        ["Giustina", "Burkle", "electric guitar"],
        ["Corry", "Marisa", "drums"],
        ["Benita", "Sikorski", "keyboard"],
        ["Merrie", "Gunn", "bass guitar"],
        ["Abbie", "Capello", "electric guitar"],
      ];
    case "ten-star.csv":
      return [
        ["StarID", "ProperName", "X", "Y", "Z"],
        ["0", "Sol", "0", "0", "0"],
        ["1", "", "282.43485", "0.00449", "5.36884"],
        ["2", "", "43.04329", "0.00285", "-15.24144"],
        ["3", "", "277.11358", "0.02422", "223.27753"],
        ["3759", "96 G. Psc", "7.26388", "1.55643", "0.68697"],
        ["70667", "Proxima Centauri", "-0.47175", "-0.36132", "-1.15037"],
        ["71454", "Rigel Kentaurus B", "-0.50359", "-0.42128", "-1.1767"],
        ["71457", "Rigel Kentaurus A", "-0.50362", "-0.42139", "-1.17665"],
        ["87666", "Barnard's Star", "-0.01729", "-1.81533", "0.14824"],
        ["118721", "", "-2.28262", "0.64697", "0.29354"],
      ];
    default:
      return null;
  }
}

export { parse };
