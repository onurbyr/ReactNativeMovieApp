import {Dimensions} from 'react-native';
import {useEffect, useState} from 'react';

const useOrientation = setImageWidth => {
  const [orientation, setOrientation] = useState(
    Dimensions.get('window').width < Dimensions.get('window').height
      ? 'PORTRAIT'
      : 'LANDSCAPE',
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({window: {width, height}}) => {
        if (width < height) {
          setOrientation('PORTRAIT');
        } else {
          setOrientation('LANDSCAPE');
        }
        setImageWidth(width);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return orientation;
};

export default useOrientation;
