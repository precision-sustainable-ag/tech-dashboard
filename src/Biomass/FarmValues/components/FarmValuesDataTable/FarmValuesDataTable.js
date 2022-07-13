import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import { onfarmAPI } from '../../../../utils/api_secret';
import { useSelector } from 'react-redux';
import IssueDialogue from '../../../../Comments/components/IssueDialogue/IssueDialogue';
import { Button } from '@material-ui/core';
import { useAuth0 } from '../../../../Auth/react-auth0-spa';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { CustomLoader } from '../../../../utils/CustomComponents';

const FarmValuesDataTable = () => {
  const userInfo = useSelector((state) => state.userInfo);
  const [farmValues, setFarmValues] = useState([]);
  const { user } = useAuth0();
  const { getTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [height, setHeight] = useState(window.innerHeight);
  const [units, setUnits] = useState('kg/ha');

  const handleResize = () => {
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize, false);
  }, []);

  const columns = [
    {
      name: 'code',
      label: 'Code',
      options: {
        filter: false,
      },
    },
    {
      name: 'subplot',
      label: 'Rep',
      options: {
        filter: false,
      },
    },
    {
      name: 'year',
      label: 'Year',
      options: {
        display: false,
        filter: true,
        sort: true,
      },
    },
    {
      name: 'affiliation',
      label: 'Affiliation',
      options: {
        display: false,
        filter: true,
        sort: true,
      },
    },
    {
      name: 'cc_termination_date',
      label: 'Termination Date',
      options: {
        filter: false,
        customBodyRender: (value) => {
          return value ? new Date(value).toLocaleDateString() : 'N/A';
        },
      },
    },
    {
      name: 'cc_species',
      label: 'Cover Crop Species',
      options: {
        filter: false,
        customBodyRender: (value) => {
          return value ? value : 'No Data';
        },
      },
    },
    {
      name: 'uncorrected_cc_dry_biomass_kg_ha',
      label: 'Uncorrected Dry Weight',
      options: {
        filter: false,
        customBodyRender: (value) => {
          if (value) {
            const correctedUnit = units === 'kg/ha' ? value : value * 0.892179;
            return Math.round(correctedUnit);
          } else {
            return 'N/A';
          }
        },
      },
    },
    {
      name: 'ash_corrected_cc_dry_biomass_kg_ha',
      label: 'Ash-Free Dry Weight',
      options: {
        filter: false,
        customBodyRender: (value) => {
          if (value) {
            const correctedUnit = units === 'kg/ha' ? value : value * 0.892179;
            return Math.round(correctedUnit);
          } else {
            return 'N/A';
          }
        },
      },
    },
    {
      name: 'percent_n_nir',
      label: '%N by NIR',
      options: {
        filter: false,
        customBodyRender: (value) => {
          return value ? Math.round(value * 10) / 10 : 'N/A';
        },
      },
    },
    {
      name: 'CN_ratio',
      label: 'C:N',
      options: {
        filter: false,
        customBodyRender: (value) => {
          return value ? Math.round(value * 10) / 10 : 'N/A';
        },
      },
    },
    {
      name: 'percent_carbohydrates',
      label: 'Carb %',
      options: {
        filter: false,
        customBodyRender: (value) => {
          return value ? Math.round(value * 10) / 10 : 'N/A';
        },
      },
    },
    {
      name: 'percent_cellulose',
      label: 'Cellulose %',
      options: {
        filter: false,
        customBodyRender: (value) => {
          return value ? Math.round(value * 10) / 10 : 'N/A';
        },
      },
    },
    {
      name: 'percent_lignin',
      label: 'Lignin %',
      options: {
        filter: false,
        customBodyRender: (value) => {
          return value ? Math.round(value * 10) / 10 : 'N/A';
        },
      },
    },
  ];

  const options = {
    filterType: 'checkbox',
    selectableRows: 'none',
    download: false,
    expandableRows: true,
    pagination: false,
    renderExpandableRow: (rowData) => {
      const colSpan = rowData.length + 1;
      return (
        <TableRow>
          <TableCell colSpan={colSpan}>
            <IssueDialogue
              nickname={user.nickname}
              rowData={rowData}
              dataType="table"
              labels={['farm-values', rowData[0], 'Subplot ' + rowData[1], rowData[3]]}
              getTokenSilently={getTokenSilently}
            />
          </TableCell>
        </TableRow>
      );
    },
    tableBodyMaxHeight: height - 160,
    expandableRowsHeader: false,
    print: false,
    rowHover: false,
    responsive: 'standard',
    customToolbar: () => {
      return (
        <Button
          onClick={() => {
            if (units === 'kg/ha') setUnits('lbs/ac');
            else setUnits('kg/ha');
          }}
        >
          {units}
        </Button>
      );
    },
    setTableProps: () => {
      return {
        padding: 'none',
      };
    },
  };

  console.log(farmValues);

  useEffect(() => {
    const fetchData = async (apiKey) => {
      const response = await fetch(`${onfarmAPI}/biomass?subplot=separate`, {
        headers: {
          'x-api-key': apiKey,
        },
      });

      const data = await response.json();
      return data;
    };

    if (userInfo.apikey) {
      setLoading(true);
      fetchData(userInfo.apikey)
        .then((response) => {
          if (response.length === 0) {
            throw new Error('No data');
          }
          setFarmValues(response);
          setLoading(false);
        })
        .catch((e) => {
          console.error(e);
          setLoading(false);
        });
    }
  }, [userInfo.apikey, farmValues.length]);

  return (
    <>
      {loading ? (
        <CustomLoader />
      ) : (
        <>
          <MUIDataTable
            title={'Farm Values'}
            data={farmValues}
            columns={columns}
            options={options}
          />
        </>
      )}
    </>
  );
};

export default FarmValuesDataTable;
