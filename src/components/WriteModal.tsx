import { MouseEventHandler } from 'react';
import styled from 'styled-components';

interface WriteModalProps {
  onClose: MouseEventHandler<HTMLButtonElement>;
}

const WriteModal = ({ onClose }: WriteModalProps) => {
  return (
    <WriteWrap className="write_modal">
      <div>
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              onClick={onClose}
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <h3 className="">Hello!</h3>
          <p className="">Press ESC key or click on ✕ button to close</p>
        </div>
      </div>
    </WriteWrap>
  );
};

export default WriteModal;

const WriteWrap = styled.div`
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 100%;
  background: #ccc;
  z-index: 999;
  max-height: 80vh;
  max-width: 50vw;
`;
