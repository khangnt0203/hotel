import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import { UserOutlined } from "@ant-design/icons";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { getUser, removeToken } from "../../../Util/Auth";

import { useHistory } from "react-router-dom";
import { getAuth } from "../../../Util/httpHelper";
function HeadBanner(props) {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [hotelName, setHotelName] = React.useState(null);
  const history = useHistory();
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    removeToken();
    history.push("/");
  };
  const user = getUser();

  return (
    <Container maxWidth="xl" style={{ marginLeft: "90%", zIndex: "1" }}>
      <Toolbar disableGutters>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton
              onClick={handleOpenUserMenu}
              style={{ top: -120, right: 150 }}
            >
              <UserOutlined />
              <div style={{ marginRight: 10, fontSize: 20 }}>{user}</div>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography textAlign="center">
                <a onClick={handleLogout}>Log out</a>
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </Container>
  );
}
export default HeadBanner;
