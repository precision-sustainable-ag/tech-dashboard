import {
  Typography,
  Card,
  CardContent,
  CardActionArea,
  useTheme,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const FarmCodeCard = (props) => {
  const { code, year, lastUpdated, data } = props;
  const theme = useTheme();

  return (
    <Card style={{backgroundColor: props.color, height: "75px"}} elevation={theme.palette.type === "dark" ? 4 : 1} >
      <CardActionArea 
        component={Link} 
        style={{height: "75px"}}
        to={
          {
            pathname: `/sensor-visuals/${year}/${code.toUpperCase()}`, 
            state: {data: data}
          }
        }>
        <CardContent style={{height: "75px"}}>
          <Typography align="center" variant="body1">
            {code.toUpperCase()}
          </Typography>
          {lastUpdated && 
            <Typography align="center" variant="body1">
              {lastUpdated}
            </Typography>
          }
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

FarmCodeCard.propTypes = {
  code: PropTypes.string.isRequired,
};

export default FarmCodeCard;
