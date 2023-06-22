import * as React from "react";
import { Box, Divider, Avatar, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import LinearProgressWithLabel from "../../../../components/customs/LinearProgress";

const converDate = (date) => {
  const originalDate = new Date(date);
  const formattedDate = `${originalDate.getUTCDate()}/${
    originalDate.getUTCMonth() + 1
  }/${originalDate.getUTCFullYear()}`;
  return formattedDate;
};

const DesTextField = (props) => {
  const {
    data: { name, value },
  } = props;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        mt: 1.5,
      }}
    >
      <Box sx={{ width: 100, fontSize: 14 }}>{name}</Box>
      <Box sx={{ fontWeight: 500, ml: 1, flexGrow: 1, fontSize: 14 }}>
        {value}
      </Box>
    </Box>
  );
};

const MainInfo = (props) => {
  const { data } = props;
  const navigate = useNavigate();
  return (
    <Box sx={{ p: 2, mt: 2 }}>
      <Divider textAlign="left">Information</Divider>
      {data && (
        <Box>
          <DesTextField
            data={{
              name: "Owner",
              value: (
                <Button
                  size="small"
                  onClick={() => navigate(`/profile/${data.ownerId._id}`)}
                  startIcon={<Avatar src={""} />}
                  sx={{
                    textTransform: "none",
                    width: "100%",
                    fontSize: 14,
                    "&.MuiButton-root": { justifyContent: "flex-start" },
                  }}
                >
                  {data?.ownerId?.name}
                </Button>
              ),
            }}
          />
          <DesTextField data={{ name: "ID", value: data.id }} />
          <DesTextField
            data={{
              name: "Category",
              value: data?.category,
            }}
          />
          <DesTextField
            data={{
              name: "Start date",
              value: converDate(data?.startDate),
            }}
          />
          <DesTextField
            data={{
              name: "End date",
              value: converDate(data?.endDate),
            }}
          />
          {data.forkFrom && (
            <DesTextField
              data={{
                name: "Clone from",
                value: (
                  <Link to={`/my-lps/${data.forkFrom}`} target="_blank">
                    {data.cloneFromName}
                  </Link>
                ),
              }}
            />
          )}
          <DesTextField
            data={{
              name: "Completed",
              value: (
                <LinearProgressWithLabel
                  value={
                    isNaN((data.completedActions / data.totalActions) * 100)
                      ? 0
                      : (data.completedActions / data.totalActions) * 100
                  }
                />
              ),
            }}
          />
        </Box>
      )}
    </Box>
  );
};
export default MainInfo;
