// import React, { useState, useEffect } from "react";
import {
  Button,
  ButtonBase,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { FiberManualRecord } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import { useEffect, useMemo, useState } from "react";
import { apiPassword, apiURL, apiUsername } from "../utils/api_secret";
// const WPAPI = require("wpapi");

const linkData = [
  {
    title: "Decomp Bags and Biomass",
    data: [
      {
        label: "Protocol",
        url:
          "https://docs.google.com/document/d/1VCGoRWoIpadd96jmpdEcjRWy5ia3nNR8rJ07_XL_K7Y/edit",
      },
      {
        label: "Decomp bag biomass video",
        url: "https://www.youtube.com/watch?v=-dBwwF906eE&t=51s",
      },
      {
        label: "Kobo decomp bag pre weight form",
        url: "https://ee.kobotoolbox.org/x/A0vJkKxS",
      },
      {
        label: "Kobo decomp bag dry weight form",
        url: "https://ee.kobotoolbox.org/x/UUEvjBK0",
      },
      {
        label: "Kobo biomass decomp bag form",
        url: "https://ee.kobotoolbox.org/x/v82BT9fq",
      },
      {
        label: "Kobo decomp bag collect form",
        url: "https://ee.kobotoolbox.org/x/mWXqWfvy",
      },
    ],
  },
  {
    title: "Acclima Sensors",
    data: [
      {
        label: "Protocol",
        url:
          "https://docs.google.com/document/d/1iUqeEHn3PLBMi9rbwVUQZcQDpdx_d-4gyS9ptdFmouI/edit",
      },
      {
        label: "Installation video",
        url: "https://www.youtube.com/watch?v=BDPQ7zMMv-A&t=170s",
      },
      {
        label: "Gateway and Node Part 1 video",
        url: "https://www.youtube.com/watch?v=zly3VXBy3pw&t=103s",
      },
      {
        label: "Gateway and Node Part 2 video",
        url: "https://www.youtube.com/watch?v=PzTtuH0uTdw",
      },
      {
        label: "Kobo water sensor install form",
        url: "https://ee.kobotoolbox.org/x/dcm60P5u",
      },
      {
        label: "Kobo water sensor uninstall form",
        url: "https://ee.kobotoolbox.org/x/becz2BBJ",
      },
    ],
  },
  {
    title: "KoBoCollect",
    data: [
      {
        label: "Protocol",
        url:
          "https://docs.google.com/document/d/1rsSmhmEXTms_MDP745cyEUPTWbbvA34DU4A3jPc34qI/edit",
      },
      {
        label: "Kobo Login",
        url: "https://kf.kobotoolbox.org/accounts/login/?next=/#/",
      },
      {
        label: "KoboCollect app tutorial video",
        url: "https://www.youtube.com/watch?v=A88vF9eqY8I&feature=youtu.be",
      },
      {
        label: "KoboCollect web tutorial video",
        url: "https://www.youtube.com/watch?v=h8NNsdYILlU",
      },
    ],
  },
  {
    title: "Yield",
    data: [
      {
        label: "Protocol",
        url:
          "https://docs.google.com/document/d/17NnUof6IQbPwM-uLFmb_O4kxxXu9CUhCa3a28pokUcA/edit",
      },
      {
        label: "Kobo yield form",
        url: "https://ee.kobotoolbox.org/x/TvRNAAyF",
      },
      {
        label: "Register to share yield monitor data",
        url: "https://www.analytics.ag/ncsu",
      },
    ],
  },
  {
    title: "Enrolling a Grower/Field Set Up",
    data: [
      {
        label: "How to Enroll a Grower Protocol",
        url:
          "https://docs.google.com/document/d/1vDT4d-1brXJZX0_bJTUQOzcseLNY_n0bOnIBIZXg-XM/edit",
      },
      {
        label: "Kobo farm history survey",
        url: "https://ee.kobotoolbox.org/x/ggAJsJ8P",
      },
      {
        label: "Kobo GPS form",
        url: "https://ee.kobotoolbox.org/x/nQY7I8Z5",
      },
      {
        label: "On-Farm Overview/ Field Design",
        url:
          "https://docs.google.com/document/d/113egv4qi2qYuWIMdy7NQJ6h1857Yxfwq/edit",
      },
    ],
  },
  {
    title: "Weeds",
    data: [],
  },
];

const Protocols = () => {
  const [htmlData, setHtmlData] = useState("");

  let data = useMemo(() => {
    const fetchData = async () => {
      let data = await fetch(`${apiURL}/api/psa/internal/pages/957`, {
        headers: {
          Authorization: "Basic " + btoa(`${apiUsername}:${apiPassword}`),
        },
      });

      return await data.text();
    };

    return fetchData();
  }, []);

  data.then((resp) => {
    setHtmlData(resp);
  });

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h5" align="left" gutterBottom>
          On-Farm Protocols
        </Typography>
      </Grid>

      <Grid item xs={12}>
        {!htmlData ? (
          <Skeleton width="100%" height="50vh" />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: htmlData ? htmlData : "" }} />
        )}
      </Grid>
    </Grid>
  );
};

export default Protocols;
