**Components**

1.  [`Timeline`](#timeline-component)
2.  [`Protocols`](#protocols-component)
3.  [`Site Enrollment`](#site-enrollment-component)
4.  [`Producer Information`](#producer-information-component)
5.  Site Information

    - [`Contact and Location`](#contact-and-location-component)
    - [`Dates`](#dates-component)

6.  Biomass
    - [`Farm Values`](#farm-values-component)
7.  [`Decomp Bags`](#decomp-bags-component)
8.  Water sensors
    - [`Device Status`](#device-status-component)
    - [`Chart View`](#water-sensor-chart-view-component)
9.  Stress Cams
    - [`Device Status`](#device-status-component)
10. [`Issues`](#issues-and-forms-components)

11. [`Forms`](#issues-and-forms-components)

---

### Timeline Component

Source: src/Landing/TaskTimeline/TaskTimeline

Renders Timeline data from PSA Internal WordPress via the [WP-JSON API](https://precisionsustainableag.org/internal/wp-json)

---

### Protocols Component

Source: src/Protocols/Protocols

Renders Protocols data from PSA Internal WordPress via the [WP-JSON API](https://precisionsustainableag.org/internal/wp-json)

---

### Producer Information Component

Source: src/ProducerInformation/ProducerInformation.js

Fetches producer information from the [OnFarm API](https://api.precisionsustainableag.org/onfarm/producers) and uses material-table to display the information in a table. Some users would be able to use the `edit` feature from the table. Users with any of the

```js
const allowEditing = () => {
  let permissions = state.userInfo.permissions;
  const allowedPermissions = ["edit", "update", "all"];
  return permissions.split(",").some((i) => allowedPermissions.includes(i));
};
```

permissions within the users table in RAW DB, would be able to edit producer information.  
The `allowEditing` function checks logged in user's permissions and returns a `bool` true or false as response.

The table only allows the following fields to be edited:-

- First Name
- Last Name/Org Name
- Email
- Phone

Other fields available as read-only are

- Producer ID
- Site Codes
- Years

---

### Site Enrollment Component

source: src/SiteEnrollment/SiteEnrollment.js

Enrolls new sites for existing farmers

Enrolls/adds new farmer and then enroll site for the farmer

Shows total sites enrolled within a user-specific set of affiliations (from users table in RAW DB)

**Component Hierarchy:**

##### SiteEnrollment

Provides a button to enroll new sites and display sites affiliated per user affiliation permissions

- ##### EnrollNewSite

  > Wrapper component that is activated when a user clicks on the enroll new site button

  - ##### GrowerInformation

    > Lets users search for the existing growers and/or
    > create a new grower record into the Postgres database. Once we have a
    > grower ID, renders the NewSiteInfo component to get site details with
    > the specific grower id

    - ##### NewSiteInfo
          > Fetches unused site codes and let users edit default
      values for sites including state, county, address, lat, long,
      additional contact, notes, etc

```jsx
EnrollNewSite.propTypes = {
  setEnrollNewSite: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),

  setSaveData: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),

  enrollNewSite: PropTypes.bool,
};
```

---

### Contact and Location Component

Renders a table with contact and location details for sites including site code, grower name, affiliation, county, year, address, latlongs, additional contact, phone number, email and notes.

The component checks if a user has edit permissions, and if they do, it enables the "unenroll" button which replaces any null values for a site in the site-information table in the Postgres database with "-999".
_Note: This feature might change in future and replaced with a different logic to unenroll a site._

---

### Dates Component

_Source: `src/SiteInformation/FarmDates/FarmDates.js`_

The dates component fetches onfarm `dates` API to display farm dates in a tabular and calendar view. The calendar view depends on the `react-big-calendar` library

FarmDatesDropdown is a nested component within this component, which, on click of the table dropdown, renders another table with `subplot`, `subsample` and T`X` Actual values from the API.

---

### Farm Values Component

_Source: `src/Biomass/FarmValues.js`_
Renders tabular biomass data from the onfarm `biomass?subplot=separate` API, with a toggle switch that converts default (kg/ha) values to lbs/ac

---

### Decomp Bags Component

_Note: This component is unoptimised and significantly slows down rendering on the front-end. Needs further introspection since it's a work in progress_

Fetches data from the following endpoints and tries to do a `LEFT JOIN` on the response.

```jsx
const freshRecords = await fetchRecords(
  onfarmAPI + `/raw?table=decomp_biomass_fresh`
);
const dryRecords = await fetchRecords(
  onfarmAPI + `/raw?table=decomp_biomass_dry`
);
const cnRecords = await fetchRecords(
  onfarmAPI + `/raw?table=decomp_biomass_cn`
);
const ashRecords = await fetchRecords(
  onfarmAPI + `/raw?table=decomp_biomass_ash`
);
```

Once the records from these four endpoints are joined together, they are rendered in a `material-table` based table.

---

### Device Status Component

This is a universal parent component for both, water sensors and stress cams.

_Source: `src/Devices/WaterSensors/WaterSensors.js`
Source: `src/Devices/StressCams/StressCams.js`_

Both the files load relevant device data (based on separate hologram API keys stored in the PHP API) from hologram using a PHP API wrapper to circumvent CORS error from Hologram.

Once all the devices are fetched, they are passed as a `prop` to the common child component called `DevicesComponent`.

```jsx
DevicesComponent.propTypes = {
  /* show devices or not? depends if user has permissions */
  showDevices: PropTypes.bool.isRequired,
  /* checks if the API is still trying to fetch devices */
  loading: PropTypes.bool.isRequired,
  /* an array of device data from hologram */
  devices: PropTypes.array.isRequired,
  /* Logged in user's info */
  userInfo: PropTypes.object,
  /* Current active tag to filter devices with, default is 'All'*/
  activeTag: PropTypes.string,
  /* Is this being rendered for water-sensors or stress-cams */
  for: PropTypes.string,
  /* From what component has this child component been called */
  from: PropTypes.string,
};
```

`DevicesComponent` renders clickable cards from the `DataParser` component, which is linked to the `<DeviceComponent />` at `src/Devices/Device/Device.js` with a dynamic URL based on the specific `device.id` from hologram.
The cards from DevicesComponent also let users edit/set nicknames to their devices, the default being the actual `device.name` from hologram. Any nickname added/edited is reflected in the RAW database in the [`hologram_device_names`](https://admin.onfarmtech.org/phpmyadmin/index.php?route=/sql&server=1&db=tech-dashboard&table=hologram_device_names&pos=0 "Browse") table.

The `<DeviceComponent />` fetches device data and timestamp via `device.id` from hologram and renders it in an infinite scroll based table.

---

### Water Sensor Chart View Component

The chart view component consists of two components, the parent component called `SensorVisuals` is located at `src/SensorVisuals/SensorVisuals.js`

`SensorVisuals` has a child component called `FarmCodeCard` located at ` src/SensorVisuals/Components/FarmCodeCard.js` that renders card based clickable farm codes.

This component fetches the onfarm API endpoint `raw?table=site_information`, then renders cards with the data from its child component (`FarmCodeCard`), along with a search box to search for codes and year chips to filter codes by year. The default selected year would be the highest year record from the onfarm API.

On click of a card, `VisualsByCode` component is rendered by `react-router-dom` with the year and code as url parameters. The `VisualsByCode` component then fetches multiple onfarm endpoints to render charts via Highcharts and all the individual charts are within the `components` folder within the `SensorVisuals` directory.

---

### Issues And Forms Components

#### Issues Component

- Renders issues from Github, and on click of the comments button, loads the `<Issue />` component that renders the issue body along with a markdown enabled text editor to add comments to the issue.
- The `<SingleIssueBodyBubble />` within the `<Issue />` component renders the parent issue body, not the comments. All comments to the issue body are rendered by the `<IssueBubbleBody />` component. This abstracts the body vs comment problem with the UI, and the dashboard can then simulate a chat based UI to a user.

#### Forms Component

The forms component fetches all kobo forms via their API using our in-house CORS wrapper built on top of PHP API, and renders all kobo form names in a stacked horizontal view.
On clicking a form card, the `<FormData />` component is rendered, with the `_xform_id_string` as a url parameter.

Form submissions are then fetched from the PHP API using the value of `_xform_id_string`.

The FormData component also looks up the `kobo_passwords` table and filters form results based on the username field, but shows all results for 'All' in users permissions.

---

### Common Components

Some of the JSX components that are used in multiple places:

- IssueDialog
- AffiliationsChips
- CustomLoader
- YearsChips
- YearsAndAffiliations

---

### Foreseeable changes and edits

Some of the near future changes that I can think of:

- Use TypeScipt along with `ts-lint` instead of the current config (`es-lint` with `JavaScript`)
- Airbnb slyge guide and conventions
- Docker setup and CI/CD workflow
- Using JWT tokens from Auth0 instead on relying on the `.env` file
- Migrate from `@auth0/auth0-spa-js` to `@auth0/auth0-react`
- Decoupling tightly-coupled components and prefer using pure components instead
- Testing

---

### Remarks

- The Timeline and Protocols components would work fine until and unless the respective pages are deleted or replaced from the WordPress dashboard, in which case, the hardcoded page ID’s in the URLS would need to be replaced [(https://github.com/precision-sustainable-ag/tech-dashboard/blob/5eee5d0cb6d8e7943936439a46186524cfac8539/src/Landing/TaskTimeline/TaskTimeline.js#L15](https://github.com/precision-sustainable-ag/tech-dashboard/blob/5eee5d0cb6d8e7943936439a46186524cfac8539/src/Landing/TaskTimeline/TaskTimeline.js#L15))

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTI1NzMxMDUxNF19
-->
