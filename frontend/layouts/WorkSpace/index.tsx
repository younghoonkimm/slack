import React, { useState, useCallback, FC } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import loadable from "@loadable/component";
import useSWR from "swr";
import axios from "axios";
import gravatar from "gravatar";

import fetcher from "@utils/fetcher";

const Channel = loadable(() => import("@pages/Channel"));
const DirectMessage = loadable(() => import("@pages/DirectMessage"));

import Menu from "@components/Menu";
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from "./style";

//VFC
const WorkSpace: FC = ({ children }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { data: userData, error, mutate } = useSWR("http://localhost:3095/api/users", fetcher, {
    dedupingInterval: 100000,
  });

  const onLogout = useCallback(() => {
    axios.post("http://localhost:3095/api/users/logout", null, { withCredentials: true }).then(() => {
      mutate(false);
    });
  }, []);

  const toggleMenu = useCallback(() => {
    setShowMenu((prev) => !prev);
  }, []);

  if (userData === undefined) {
    return <div></div>;
  }

  if (!userData) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        {userData && (
          <RightMenu>
            <span onClick={toggleMenu}>
              <ProfileImg src={gravatar.url(userData.email, { s: "28px", d: "retro" })} alt={userData.nickname} />
            </span>
            {showMenu && (
              <Menu style={{ right: 0, top: 38 }} showMenu={showMenu} onCloseModal={toggleMenu}>
                <ProfileModal>
                  <img src={gravatar.url(userData.email, { s: "36px", d: "retro" })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </RightMenu>
        )}
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {/* {userData?.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${ws.url}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })} */}
          <AddButton>+</AddButton>
        </Workspaces>
        <Channels>
          {/* <WorkspaceName onClick={toggleWorkspaceModal}>
            {userData?.Workspaces.find((v) => v.url === workspace)?.name}
          </WorkspaceName> */}
          <MenuScroll>
            {/* <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>{userData?.Workspaces.find((v) => v.url === workspace)?.name}</h2>
                <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={onLogOut}>로그아웃</button>
              </WorkspaceModal>
            </Menu> */}
            {/* <ChannelList />
            <DMList /> */}
          </MenuScroll>
        </Channels>
        <Chats>
          chats
          <Switch>
            <Route path="/workspace/channel/" component={Channel} />
            <Route path="/workspace/dm/" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      {/* <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace-url" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
      <InviteWorkspaceModal
        show={showInviteWorkspaceModal} 
        onCloseModal={onCloseModal}
        setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
      />
      <ToastContainer position="bottom-center" /> */}
    </div>
  );
};

export default WorkSpace;
