import React from "react";

import { categoryIcons } from "../../constants";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Grid, Button } from "@mui/material";

const CourseList = (props) => {
  const navigate = useNavigate();
  const { loading, courses } = props;

  const { pathname } = useLocation();

  const handleClick = (id) => {
    navigate(`${pathname}/${id}?tab=lesson`);
  };

  return (
    <Box
      sx={{
        background: "white",
        borderRadius: 3,
        mt: 2,
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "row",
        pt: 0,
      }}
    >
      {loading ? (
        <div className="col-12">Loading ...</div>
      ) : (
        <Grid
          container
          spacing={{ xs: 1, md: 1 }}
          columns={{ xs: 1, sm: 3, md: 12 }}
        >
          {courses &&
            courses.map((item, index) => {
              return (
                <Grid item xs={4} sm={4} md={4} key={index}>
                  <Box
                    sx={{
                      position: "relative",
                      color: "#6c68f3",
                      background: "white",
                      m: 1,
                      mt: 0,
                      borderRadius: 2,
                      boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                      textAlign: "right",
                    }}
                  >
                    <Box
                      sx={{
                        textAlign: "center",
                        pt: 3,
                      }}
                    >
                      <img
                        src={categoryIcons[item.category]}
                        width={100}
                        height={100}
                        alt=""
                      />
                    </Box>
                    <Box sx={{}}>
                      <Box
                        sx={{
                          fontSize: 14,
                          fontWeight: 500,
                          textAlign: "center",
                          my: 1,
                        }}
                      >
                        {item.name}
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: "center", pb: 2 }}>
                      <Button
                        onClick={() => handleClick(item.id)}
                        size="small"
                        sx={{
                          textTransform: "none",
                          color: "#6c68f3",
                          background: "white",
                          border: "2px solid #6c68f3",
                          "&:hover": { background: "#fff" },
                        }}
                      >
                        View detail
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
        </Grid>
      )}
    </Box>
  );
};

export default React.memo(CourseList, (prev, next) => {
  if (prev.courses !== next.courses) return false;
  if (prev.showTypeProds !== next.showTypeProds) return false;
  return true;
});
