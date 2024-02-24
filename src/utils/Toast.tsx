import {Toast} from '@gluestack-ui/themed';
import commonStyles from './commonStyles';
import {Text} from 'react-native';

export const showToast = ({toast, text}: {toast: any; text: string}) => {
  toast.show({
    placement: 'top',
    render: ({id}: {id: string}) => {
      const toastId = 'toast-' + id;
      return (
        <Toast nativeID={toastId} action="attention" variant="solid">
          <Text style={commonStyles.textMedium}>{text}</Text>
        </Toast>
      );
    },
  });
};
