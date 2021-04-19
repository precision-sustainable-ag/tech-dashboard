import { Grid, Typography } from "@material-ui/core";
import { Fragment, useContext, useEffect, useState } from "react";
import { Context } from "../../Store/Store";
import { onfarmAPI } from "../../utils/api_secret";
import {
  CustomLoader,
  YearsAndAffiliations,
} from "../../utils/CustomComponents";
import { uniqueYears, UserIsEditor } from "../../utils/SharedFunctions";
import SiteInformationTable from "./SiteInformationTable";

const siteInfoAPI_URL = `${onfarmAPI}/raw?output=json&table=site_information${
  process.env.NODE_ENV === "development" ? "&options=showtest" : ""
}`;

const currentYear = new Date().getFullYear();

const tableHeaders = [
  "Code",
  "Grower",
  "Affiliation",
  "County",
  "Year",
  "Field Address",
  "Notes",
];

const ContactAndLocation = (props) => {
  const [state] = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [affiliations, setAffiliations] = useState([]);
  const [editableStates, setEditableStates] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const activeFarmYear = () => {
    const activeYear = years.filter((rec) => rec.active).map((rec) => rec.year);

    return parseInt(activeYear);
  };
  const activeAffiliation = () => {
    return (
      affiliations
        .filter((rec) => rec.active)
        .map((rec) => rec.affiliation)
        .toString() || "all"
    );
  };
  const handleActiveYear = (year = "") => {
    const newFarmYears = years.map((yearInfo) => {
      return { active: year === yearInfo.year, year: yearInfo.year };
    });
    const sortedNewFarmYears = newFarmYears.sort((a, b) => b - a);

    setYears(sortedNewFarmYears);
  };

  const handleActiveAffiliation = (affiliation = "all") => {
    const newAffiliations = affiliations.map((rec) => {
      return {
        active: affiliation === rec.affiliation,
        affiliation: rec.affiliation,
      };
    });
    const sortedNewAffiliations = newAffiliations.sort((a, b) =>
      b.affiliation < a.affiliation ? 1 : b.affiliation > a.affiliation ? -1 : 0
    );

    setAffiliations(sortedNewAffiliations);
  };
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const response = await fetch(siteInfoAPI_URL, {
        headers: {
          "x-api-key": state.userInfo.apikey,
          "Content-Type": "application/json",
        },
      });
      const records = await response.json();
      return records;
    };

    fetchData().then((rec) => {
      setTableData(rec);
      let allYears = rec.map((record) => record.year);

      setYears(uniqueYears(allYears));
      const affiliations = rec
        .reduce(
          (prev, curr, index, arr) =>
            !prev.includes(curr.affiliation)
              ? [...prev, curr.affiliation]
              : [...prev],
          []
        )
        .map((aff) => {
          return {
            affiliation: aff,
            active: false,
          };
        });
      const sortedAffiliations = affiliations.sort((a, b) =>
        b.affiliation < a.affiliation
          ? 1
          : b.affiliation > a.affiliation
          ? -1
          : 0
      );
      setAffiliations(sortedAffiliations);
      setLoading(false);
    });
  }, [state.userInfo]);

  return loading ? (
    <CustomLoader />
  ) : (
    <Grid container spacing={2}>
      <YearsAndAffiliations
        title="Contact And Location"
        years={years}
        affiliations={affiliations}
        handleActiveAffiliation={handleActiveAffiliation}
        handleActiveYear={handleActiveYear}
      />
      <Grid item xs={12}>
        <SiteInformationTable
          headers={tableHeaders}
          data={tableData}
          year={activeFarmYear() || currentYear}
          affiliation={activeAffiliation() || "all"}
        />
      </Grid>
    </Grid>
  );
};

export default ContactAndLocation;
