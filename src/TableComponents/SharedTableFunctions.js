export const cleanYears = (data) => {
  const allYears = data.map((record) => record.year);
  const allYearsUniqueAndSorted = [...new Set(allYears)].sort();
  return allYearsUniqueAndSorted;
};

export const cleanAff = (data) => {
  let allAffiliations = data
    .filter((record) => record.affiliation !== undefined)
    .reduce(
      (prev, curr) => (!prev.includes(curr.affiliation) ? [...prev, curr.affiliation] : [...prev]),
      [],
    );
  allAffiliations.sort();
  allAffiliations.unshift('All');
  return allAffiliations;
};

export const filterData = (data, pickedYears, pickedAff) => {
  const filteredYears = data.filter((row) => pickedYears.includes(row.year));

  const filteredAff = pickedAff.includes('All')
    ? filteredYears
    : filteredYears.filter((row) => pickedAff.includes(row.affiliation));

  return filteredAff;
};
