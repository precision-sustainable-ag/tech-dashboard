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
  const { code, year } = props;
  const theme = useTheme();
  console.log(props.installed)

  return (
    <Card style={props.installed ? {backgroundColor: theme.palette.primary.main} : {backgroundColor: theme.palette.primary.secondary}} elevation={theme.palette.type === "dark" ? 4 : 1}>
      <CardActionArea component={Link} to={`/sensor-visuals/${year}/${code}`}>
        <CardContent>
          <Typography align="center" variant="body1">
            {code}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

FarmCodeCard.propTypes = {
  code: PropTypes.string.isRequired,
};

export default FarmCodeCard;
