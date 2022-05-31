const RenderGrid = () => {

  const RenderGridListData = () => {
    return (
      <Grid container spacing={3}>
        <DeviceInfo
          // timeEnd={timeEnd}
          // setTimeEnd={setTimeEnd}
          deviceName={deviceName}
          // deviceData={deviceData}
          // userTimezone={userTimezone}
        />

        {props.location.state ? (
          props.location.state.for !== 'watersensors' ? (
            <StressCamButtons deviceId={props.history.location.state.id} />
          ) : (
            ''
          )
        ) : (
          ''
        )}
        {siteCode &&
          chartRedirectYear !== 0 &&
          (props.location.state ? props.location.state.for === 'watersensors' : true) && (
            <Grid item xs={12}>
              <Button
                size={'small'}
                component={Link}
                startIcon={<Timeline />}
                to={{
                  pathname: `/sensor-visuals/${chartRedirectYear}/${siteCode}`,
                  state: {
                    activeTag: activeTag,
                  },
                }}
              >
                Chart view
              </Button>
            </Grid>
          )}

        <Grid item xs={12}>
          <DeviceData
            location={props.location.state}
            // mostRecentData={mostRecentData}
            // userTimezone={userTimezone}
            isFetching={isFetching}
          />
        </Grid>
        {isFetching && (
          <Grid item xs={12}>
            <Grid container justifyContent="center" alignItems="center" spacing={3}>
              {hologramApiFunctional && (
                <Grid item>
                  <Loading
                    className="scrollLoadingSpinner"
                    width={50}
                    height={50}
                    type="spinningBubbles"
                    color="#2d2d2d"
                  />
                </Grid>
              )}
              <Grid item>
                <Typography variant="h5">{fetchMessage}</Typography>
              </Grid>
              {!hologramApiFunctional && (
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => {
                      fetchedCount = 0;
                      setHologramApiFunctional(true);
                      fetchMoreData();
                    }}
                  >
                    Fetch more data
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
    );
  };

  const RenderGridListMap = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color={isDarkTheme ? 'primary' : 'default'}
            aria-label={`All Devices`}
            component={Link}
            tooltip="All Devices"
            to={{
              pathname:
                props.location.state && props.location.state.for
                  ? props.location.state.for === 'watersensors'
                    ? '/devices/water-sensors'
                    : '/devices/stress-cams'
                  : '/devices',
              state: {
                activeTag:
                  history.location.state && history.location.state.activeTag
                    ? history.location.state.activeTag
                    : 'All',
              },
            }}
            startIcon={<ArrowBackIosOutlined />}
          >
            All Devices
          </Button>
        </Grid>
        {/* <Grid item xs={12}>
          <div style={{ height: "350px" }}>
            {state.lastsession ? (
              <GoogleMap
                lat={latLng.data[0]}
                lng={latLng.data[1]}
                from={"device"}
              />
            ) : (
              <GoogleMap from={"device"} />
            )}
          </div>
        </Grid> */}
      </Grid>
    );
  };
}