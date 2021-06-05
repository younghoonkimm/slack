import React, { FC, CSSProperties, PropsWithChildren, useCallback } from "react";
import { CreateMenu, CloseModalButton } from "./style";

interface Props {
  style: CSSProperties;
  showMenu: boolean;
  onCloseModal: () => void;
  closeButton?: boolean;
}

const Menu: FC<PropsWithChildren<Props>> = ({ children, style, showMenu, onCloseModal, closeButton }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!showMenu) {
    return null;
  }

  return (
    <CreateMenu onClick={onCloseModal}>
      <div onClick={stopPropagation} style={style}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        <div>menu</div>
        {children}
      </div>
    </CreateMenu>
  );
};

Menu.defaultProps = {
  closeButton: true,
};

export default Menu;
