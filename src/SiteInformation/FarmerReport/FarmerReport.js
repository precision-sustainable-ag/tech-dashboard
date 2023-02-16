import { Grid, TextField, Typography } from '@material-ui/core';
import React, { useState, useEffect, useMemo } from 'react';
import { onfarmAPI } from '../../utils/api_secret';
import { CustomLoader } from '../../utils/CustomComponents';
import YearsChips from '../../utils/YearsChips';
import AffiliationsChips from '../../utils/AffiliationsChips';
import { groupBy } from '../../utils/constants';
import FarmerReportCard from './components/FarmerReportCard';
import { Search } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FarmerReport = () => {
  const history = useHistory();
  const location = history.location;
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [affiliations, setAffiliations] = useState(['all']);
  const userInfo = useSelector((state) => state.userInfo);
  const [codeSearchText, setCodeSearchText] = useState('');

  const handleActiveYear = (year = '') => {
    const newYears = years.map((yearInfo) => {
      return { active: year === yearInfo.year, year: yearInfo.year };
    });
    const sortedNewYears = newYears.sort((a, b) => b.year - a.year);
    setYears(sortedNewYears);
  };

  useEffect(() => {
    if (location.state && location.state.data) {
      setData(location.state.data);
    }

    const fetchData = async (apiKey) => {
      setLoading(true);
      const endpoint = onfarmAPI + `/raw?table=site_information`;
      if (apiKey) {
        try {
          const records = await fetch(endpoint, {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
            },
          });
          let response = await records.json();

          if (data.length === 0) {
            setLoading(false);
            let responseWithFilter = response.filter((r) => {
              return r.protocols_enrolled !== '-999';
            });
            setData(responseWithFilter);
          }

          const recs = groupBy(response, 'year');
          const currentYear = new Date().getFullYear().toString();

          const greatestGivenYear = Object.keys(recs).sort((a, b) => b - a)[0];
          const highlightedYear = greatestGivenYear < currentYear ? greatestGivenYear : currentYear;

          const uniqueYears = Object.keys(recs)
            .sort((a, b) => b - a)
            .map((y) => {
              if (location.state) {
                if (location.state.year)
                  return {
                    year: y,
                    active: location.state.year === y,
                  };
                else
                  return {
                    year: y,
                    active: currentYear === y,
                  };
              } else {
                return {
                  year: y,
                  active: highlightedYear === y,
                };
              }
            });
          setYears(uniqueYears);

          const uniqueAffiliations = Object.keys(groupBy(response, 'affiliation'))
            // .sort((a, b) => b - a)
            .map((a) => {
              return {
                affiliation: a,
                active: false,
              };
            });

          const sortedUniqueAffiliations = uniqueAffiliations.sort((a, b) =>
            b.affiliation < a.affiliation ? 1 : b.affiliation > a.affiliation ? -1 : 0,
          );

          setAffiliations(sortedUniqueAffiliations);
        } catch (e) {
          setYears([]);
          setAffiliations([]);
        }
      } else {
        setYears([]);
        setAffiliations([]);
      }
    };

    fetchData(userInfo.apikey);
  }, [userInfo.apikey, location.state, data.length]);

  useEffect(() => {
    return () => {
      setData([]);
      setCodeSearchText('');
    };
  }, [userInfo.apikey, location]);

  const activeData = useMemo(() => {
    const activeYear = years.reduce((acc, curr) => {
      if (curr.active) {
        return curr.year;
      } else return acc;
    }, '');

    const activeAffiliation = affiliations.reduce((acc, curr) => {
      if (curr.active) return curr.affiliation;
      else return acc;
    }, '');

    if (!codeSearchText) {
      if (activeAffiliation === '') {
        return data.filter((data) => data.year === activeYear);
      } else {
        return data.filter(
          (data) => data.year === activeYear && data.affiliation === activeAffiliation,
        );
      }
    } else {
      if (activeAffiliation === '') {
        return data.filter(
          (data) => data.year === activeYear && data.code.includes(codeSearchText),
        );
      } else {
        return data.filter(
          (data) =>
            data.year === activeYear &&
            data.affiliation === activeAffiliation &&
            data.code.includes(codeSearchText),
        );
      }
    }
  }, [years, data, affiliations, codeSearchText]);

  const activeAffiliation = () => {
    return (
      affiliations
        .filter((rec) => rec.active)
        .map((rec) => rec.affiliation)
        .toString() || 'all'
    );
  };

  const handleActiveAffiliation = (affiliation = 'all') => {
    const newAffiliations = affiliations.map((rec) => {
      return {
        active: affiliation === rec.affiliation,
        affiliation: rec.affiliation,
      };
    });
    const sortedNewAffiliations = newAffiliations.sort((a, b) =>
      b.affiliation < a.affiliation ? 1 : b.affiliation > a.affiliation ? -1 : 0,
    );

    setAffiliations(sortedNewAffiliations);
  };

  return loading && data.length === 0 ? (
    <CustomLoader />
  ) : downloading ? (
    <CustomLoader />
  ) : (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5">Farmer Report</Typography>
      </Grid>
      <Grid item container justifyContent="space-between" spacing={2}>
        <Grid item container spacing={2} xs={12} md={6} lg={9}>
          <Grid item sm={2} md={1} xs={12}>
            <Typography variant="body1">Years</Typography>
          </Grid>
          <YearsChips years={years} handleActiveYear={handleActiveYear} />
        </Grid>
        {affiliations.length > 1 && (
          <Grid item container spacing={2} xs={12}>
            <Grid item sm={2} md={1} xs={12}>
              <Typography variant="body1">Affiliations</Typography>
            </Grid>
            <AffiliationsChips
              activeAffiliation={activeAffiliation() || 'all'}
              affiliations={affiliations}
              handleActiveAffiliation={handleActiveAffiliation}
            />
          </Grid>
        )}
        <Grid item container direction="row-reverse">
          <Grid item xs={12} md={6} lg={3}>
            <TextField
              variant="outlined"
              label="Search Codes"
              fullWidth
              InputProps={{
                startAdornment: <Search />,
              }}
              value={codeSearchText}
              onChange={(e) => setCodeSearchText(e.target.value.toUpperCase())}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item container spacing={2} xs={12}>
        <Grid item sm={12} md={12} xs={12}>
          <Typography variant="h5">
            The buttons below will generate reports for your growers. A Word document will be
            downloaded to your computer; this will take about 15 seconds to complete. Make sure to
            review the file and edit it as appropriate for your grower. You may wish to rename or
            remove sections, or add photos from the site.
          </Typography>
        </Grid>
      </Grid>
      <Grid item container spacing={4} xs={12}>
        {activeData.map((entry, index) => (
          <Grid item key={index} xl={2} lg={3} md={4} sm={6} xs={12}>
            <FarmerReportCard
              code={entry.code}
              setDownloading={setDownloading}
              apiKey={userInfo.apikey}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default FarmerReport;
