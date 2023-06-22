import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import styled from "styled-components";
import { useAuth } from "../../contexts/Auth";
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  Tooltip,
  MenuItem,
  Chip,
  ListItemIcon,
  Menu,
  Badge,
} from "@mui/material";
import NotificationsActiveTwoToneIcon from "@mui/icons-material/NotificationsActiveTwoTone";
import Notification from "../Notification";

const NavbarCustom = styled.div`
  .menuItem {
    color: black;
    font-style: initial;
    font-weight: 500;
  }
  .menuRight {
    display: flex;
    justify-content: flex-start;
  }
  .active {
    color: orange;
    text-shadow: 3px 0px 7px #ffa500c4, -3px 0px 7px #ffa50091,
      0px 4px 7px #ffa50057;
  }
`;
const Header = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElNotif, setAnchorElNotif] = React.useState(null);
  const auth = useAuth();
  const navigate = useNavigate();
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    auth.signout(() => navigate("/login", { replace: true }));
  };

  return (
    <NavbarCustom>
      <nav className="navbar navbar-expand-lg ">
        <a className="navbar-brand" href="#">
          <img
            width="150px"
            src="https://t3.ftcdn.net/jpg/03/92/80/46/360_F_392804645_tUQxo5EgPXvFGxn5OQguX1BiYlI6lCOV.jpg"
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink className="nav-link menuItem" to="/">
                News
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link menuItem" to="/courses">
                Course
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link menuItem" to="/teachers">
                Teacher
              </NavLink>
            </li>
          </ul>
          <Box sx={{ mr: 2 }}>
            <IconButton
              onClick={(e) => setAnchorElNotif(e.currentTarget)}
              sx={{ color: "#6c68f3" }}
            >
              <Badge badgeContent={5} max={99} color="info">
                <NotificationsActiveTwoToneIcon />
              </Badge>
            </IconButton>
            <Notification
              anchorEl={anchorElNotif}
              handleClose={() => setAnchorElNotif(null)}
            />
          </Box>
          <Box sx={{ mr: 1 }}>
            <Chip label={auth.user.name} />
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  sx={{ border: "2px solid white" }}
                  alt="Avatar"
                  src={""}
                />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key={"profile"} onClick={handleCloseUserMenu}>
                <ListItemIcon>
                  <Avatar
                    sx={{ border: "2px solid white" }}
                    alt="Avatar"
                    src={``}
                  />
                </ListItemIcon>
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to={``}
                >
                  <Typography textAlign="center">Profile</Typography>
                </Link>
              </MenuItem>
              <MenuItem key={"setting"} onClick={handleCloseUserMenu}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to="/settings"
                >
                  <Typography textAlign="center">Setting</Typography>
                </Link>
              </MenuItem>
              <MenuItem key={"logout"} onClick={handleLogut}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </div>
      </nav>
    </NavbarCustom>
  );
};

export default Header;
