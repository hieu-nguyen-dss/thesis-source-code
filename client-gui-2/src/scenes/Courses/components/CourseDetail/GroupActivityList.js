import React from "react";
import {
  Box,
  Stack,
  Card,
  Typography,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PreviewRoundedIcon from "@mui/icons-material/PreviewRounded";
import LoginIcon from "@mui/icons-material/Login";
import { AppContext } from "../../../../contexts/AppProvider";
import { AuthContext } from "../../../../contexts/AuthProvider";
import LoginGroupChat from "../../../../components/Login";
import { addDocument } from "../../../../firebase/services";
import { useSnackbar } from "../../../../contexts";
import { SNACKBAR } from "../../../../constants";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const GroupActivityList = ({ nameCourse }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { rooms, setSelectedRoomId } = React.useContext(AppContext);
  const roomsFilter = rooms?.filter((r) => r.courseId === id);
  const { openSnackbar } = useSnackbar();
  const {
    user: { uid },
  } = React.useContext(AuthContext);
  const [openCreateNew, setOpenCreateNew] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newDescription, setNewDescription] = React.useState("");
  const handleCloseCreateNew = () => {
    setOpenCreateNew(false);
  };

  const handleSubmitCreateRoom = () => {
    try {
      addDocument("rooms", {
        name: newName,
        description: newDescription,
        members: [uid],
        membersCall: [],
        owner: { uid },
        courseId: id,
      });
      openSnackbar(SNACKBAR.SUCCESS, "Create new room successfully");
      setNewName("");
      setNewDescription("");
      setOpenCreateNew(false);
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, "Create new room failed");
    }
  };

  return uid ? (
    <Box
      sx={{
        background: "white",
        p: 2,
        mt: 2,
        borderRadius: 3,
        minHeight: "calc(100vh - 140px)",
      }}
    >
      <Box>
        <Grid
          container
          spacing={{ xs: 1, md: 1 }}
          columns={{ xs: 1, sm: 3, md: 12 }}
        >
          <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
            {roomsFilter &&
              roomsFilter.map((rm, index) => (
                <Box
                  key={index}
                  style={{ textTransform: "none", textDecoration: "none" }}
                >
                  <Card variant="outlined" sx={{ minWidth: 300 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image="https://www.aihr.com/wp-content/uploads/organizational-design-cover.png"
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom sx={{ fontSize: 16 }}>
                        {rm.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {rm.members.length} users
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Stack direction="row">
                        <Tooltip title="Information">
                          <IconButton onClick={() => {}}>
                            <PreviewRoundedIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Detail">
                          <IconButton
                            onClick={() => {
                              setSelectedRoomId(rm.id);
                              navigate(`${location.pathname}/room/${rm.id}`, {
                                state: {
                                  courseName: nameCourse,
                                  name: rm.name,
                                },
                              });
                            }}
                          >
                            <LoginIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </CardActions>
                  </Card>
                </Box>
              ))}
          </Stack>
          <Grid item xs={1} sm={1} md={3}>
            <Button
              onClick={() => setOpenCreateNew(true)}
              sx={{
                color: "#6c68f3",
                background: "white",
                border: "dashed 2px #6c68f3",
                borderRadius: 0,
                m: 2,
                mt: 0,
                width: 50,
                height: 50,
                flexGrow: 1,
              }}
            >
              <AddIcon />
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Dialog open={openCreateNew} onClose={handleCloseCreateNew}>
        <DialogTitle>Create New Room</DialogTitle>
        <DialogContent>
          <TextField
            size="small"
            required
            fullWidth
            label="Group name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            size="small"
            required
            fullWidth
            label="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            sx={{ mb: 2, mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateNew}>Cancel</Button>
          <Button onClick={handleSubmitCreateRoom} autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  ) : (
    <LoginGroupChat />
  );
};

export default GroupActivityList;
