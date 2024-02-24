import React, {useState, ComponentType} from 'react';

export interface WithLoadingProps {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

function withLoading<T extends object>(
  WrappedComponent: ComponentType<T>,
): React.FC<T & WithLoadingProps> {
  const WithLoading: React.FC<T & WithLoadingProps> = props => {
    const [isLoading, setIsLoading] = useState(false);

    const startLoading = () => {
      setIsLoading(true);
    };

    const stopLoading = () => {
      setIsLoading(false);
    };

    return (
      <WrappedComponent
        {...(props as T)}
        isLoading={isLoading}
        startLoading={startLoading}
        stopLoading={stopLoading}
      />
    );
  };

  return WithLoading;
}

export default withLoading;
