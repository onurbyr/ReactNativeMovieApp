import {Dimensions} from 'react-native';
import {useEffect, useState} from 'react';

const useOrientation = () => {
  const [orientation, setOrientation] = useState('PORTRAIT');

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({window: {width, height}}) => {
        if (width < height) {
          setOrientation('PORTRAIT');
        } else {
          setOrientation('LANDSCAPE');
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return orientation;
};

export default useOrientation;
