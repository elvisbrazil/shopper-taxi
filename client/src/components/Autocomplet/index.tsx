"use client"

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import loader from '../../utils/googleMapsLoader';

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

interface AutocompleteInputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ placeholder, value, onChange, icon }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initAutocomplete = async () => {
      const { Autocomplete } = await loader.importLibrary('places');

      if (inputRef.current) {
        const newAutocomplete = new Autocomplete(inputRef.current, {
          types: ['geocode'],
          componentRestrictions: { country: 'BR' },
        });

        newAutocomplete.addListener('place_changed', () => {
          const place = newAutocomplete.getPlace();
          onChange({ target: { value: place.formatted_address || '' } } as React.ChangeEvent<HTMLInputElement>);
        });
      }
    };

    initAutocomplete();
  }, [onChange]);

  return (
    <InputWrapper>
      {icon}
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </InputWrapper>
  );
};

export default AutocompleteInput;

