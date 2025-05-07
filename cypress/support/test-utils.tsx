// cypress/support/test-utils.tsx
import React from 'react';

export const mockComponent = (name) => {
  return function MockComponent(props) {
    return (
      <div data-testid={`mocked-${name}`} data-props={JSON.stringify(props)}>
        {name} (Mocked)
      </div>
    );
  };
};
