const SharedTableOptions = (height, tableName, isExport) => {
  return {
    paging: false,
    defaultExpanded: false,
    padding: 'dense',
    exportButton: false,
    exportFileName: tableName,
    addRowPosition: 'last',
    exportAllData: isExport,
    groupRowSeparator: '   ',
    grouping: true,
    headerStyle: {
      fontWeight: 'bold',
      fontFamily: 'Bilo, sans-serif',
      fontSize: '0.8em',
      textAlign: 'left',
      position: 'sticky',
      top: 0,
    },
    rowStyle: () => ({
      fontFamily: 'Roboto, sans-serif',
      fontSize: '0.8em',
      textAlign: 'left',
    }),
    selection: false,
    searchAutoFocus: false,
    toolbarButtonAlignment: 'left',
    actionsColumnIndex: 1,
    maxBodyHeight: window.innerWidth > 768 ? height - 180 : height - 120,
  };
};

export default SharedTableOptions;
