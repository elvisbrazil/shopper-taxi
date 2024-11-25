import React from 'react';
import styled from 'styled-components';

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  outline: none;
`;

interface UserIdInputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
}

const UserIdInput: React.FC<UserIdInputProps> = ({ placeholder, value, onChange, icon }) => {
  return (
    <InputWrapper>
      {icon}
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </InputWrapper>
  );
};

export default UserIdInput;