import React, { VFC, useCallback } from "react";
import { useParams } from "react-router";
import axios from "axios";
import useSWR from "swr";
import { toast } from "react-toastify";

import Modal from "@components/Modal";
import useInput from "@hooks/useInput";
import { Button, Input, Label } from "@pages/Sign/styles";
import { IChannel, IUser } from "@typings/db";
import fetcher from "@utils/fetcher";

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}
const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const params = useParams<{ workspace?: string; channel?: string }>();
  const { workspace } = params;
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput("");
  const { data: userData } = useSWR<IUser | false>("/api/users", fetcher);
  const { revalidate: revalidateChannel } = useSWR<IChannel[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );

  const onCreateChannel = useCallback(
    (e) => {
      e.preventDefault();
      if (!newChannel || !newChannel.trim()) {
        return;
      }
      axios
        .post(
          `http://localhost:3095/api/workspaces/${workspace}/channels`,
          {
            name: newChannel,
          },
          { withCredentials: true },
        )
        .then(() => {
          revalidateChannel();
          setShowCreateChannelModal(false);
          setNewChannel("");
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: "bottom-center" });
        });
    },
    [newChannel],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널 이름</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button>생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
