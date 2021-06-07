import React, { useState, useCallback, FC } from "react";
import { Redirect, Switch, Route, Link, useParams } from "react-router-dom";
import loadable from "@loadable/component";
import useSWR from "swr";
import axios from "axios";
import gravatar from "gravatar";
import { toast } from "react-toastify";

import { Button, Input, Label } from "@pages/Sign/styles";

const Channel = loadable(() => import("@pages/Channel"));
const DirectMessage = loadable(() => import("@pages/DirectMessage"));

import { IUser, IChannel } from "@typings/db";
import Menu from "@components/Menu";
import Modal from "@components/Modal";
import CreateChannelModal from "@components/CreateChannelModal";
import fetcher from "@utils/fetcher";
import useInput from "@hooks/useInput";

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
  const [showCreateWorkSpaceModal, setShowCreateWorkSpaceModal] = useState(false);
  const [showCreateChannelSpaceModal, setShowCreateChannelSpaceModal] = useState(false);
  const [showWorkSpaceModal, setShowWorkStateModal] = useState(false);
  const [newWorkSpace, onChangeNewWorkSpace, setNewWorkSpace] = useInput("");
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput("");

  const params = useParams<{ workspace?: string }>();

  const { workspace } = params;

  const { data: userData, error, mutate, revalidate } = useSWR<IUser | false>(
    "http://localhost:3095/api/users",
    fetcher,
    {
      dedupingInterval: 100000,
    },
  );

  const { data: channelData } = useSWR<IChannel[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null,
    fetcher,
    {
      dedupingInterval: 100000,
    },
  );

  const onLogout = useCallback(() => {
    axios.post("http://localhost:3095/api/users/logout", null, { withCredentials: true }).then(() => {
      mutate(false);
    });
  }, []);

  const createWorkSpace = useCallback(() => {
    setShowCreateWorkSpaceModal(true);
  }, []);

  const onCreateWorkspace = useCallback(
    (e) => {
      e.preventDefault();
      if (!newWorkSpace || !newWorkSpace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      if (!newWorkSpace) return;

      axios
        .post(
          "http://localhost:3095/api/workspaces",
          { workspace: newWorkSpace, url: newUrl },
          { withCredentials: true },
        )
        .then(() => {
          revalidate();
          setShowCreateWorkSpaceModal(false);
          setNewWorkSpace("");
          setNewUrl("");
        })
        .catch((e) => {
          console.dir(e);
          toast.error(error.response?.data, { position: "bottom-center" });
        });
    },
    [newWorkSpace, newUrl],
  );

  const onCloseProfileModal = useCallback((e) => {
    e.stopPropagation;
    setShowMenu(false);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkSpaceModal(false);
  }, []);

  const onChangeNewWorkspace = useCallback(() => {}, []);

  const onClickInviteWorkspace = useCallback(() => {}, []);

  const onClickAddChannel = useCallback((e) => {
    setShowCreateChannelSpaceModal(true);
  }, []);

  const toggleMenu = useCallback(() => {
    setShowMenu((prev) => !prev);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkStateModal((prev) => !prev);
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
              <Menu style={{ right: 0, top: 38 }} showMenu={showMenu} onCloseModal={onCloseProfileModal}>
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
          {userData?.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${ws.url}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={createWorkSpace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={toggleWorkspaceModal}>
            {/* {userData?.Workspaces.find((v) => v.url === workspace)?.name} */}
          </WorkspaceName>
          <MenuScroll>
            <Menu showMenu={showWorkSpaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>{userData?.Workspaces.find((v) => v.url === workspace)?.name}</h2>
                <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            {channelData?.map((v) => (
              <div key={v.id}>{v.name}</div>
            ))}
            {/* <ChannelList />
            <DMList /> */}
          </MenuScroll>
        </Channels>
        <Chats>
          chats
          <Switch>
            <Route path="/workspace/:workspace/channel" component={Channel} />
            <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkSpaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkSpace} onChange={onChangeNewWorkSpace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace-url" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      <CreateChannelModal
        show={showCreateChannelSpaceModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelSpaceModal}
      />
      {/* 
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
