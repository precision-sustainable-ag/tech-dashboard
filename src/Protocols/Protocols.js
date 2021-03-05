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
import { useEffect, useMemo, useState } from "react";
const WPAPI = require("wpapi");

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
  const [data, setData] = useState([]);
  // let response = useMemo(() => {
  //   let wp = new WPAPI({
  //     endpoint: "https://precisionsustainableag.org/internal/wp-json",
  //   });
  //   return wp
  //     .pages()
  //     .id(957)
  //     .get((e, d) => {
  //       return d;
  //     });
  // }, []);

  // response.then((d) => {
  //   console.log(d);
  // });

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h5" align="center">
          On-Farm Protocols
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          {linkData.map((val, i) => (
            <Grid item key={`${i}-${val.title}`} xs={3}>
              <Card style={{ minHeight: "440px" }}>
                <CardHeader title={val.title} />
                <Divider />
                <CardContent>
                  <List>
                    {val.data.length > 0 ? (
                      val.data.map((entries, index) => (
                        <ListItemLink
                          href={entries.url}
                          key={`${i}${index}-${entries.label}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ListItemText primary={entries.label} />
                        </ListItemLink>
                      ))
                    ) : (
                      <ListItem>
                        <Typography variant="body1">
                          Coming Spring 2021
                        </Typography>
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}
export default Protocols;
