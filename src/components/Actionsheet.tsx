import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from '@gluestack-ui/themed';
import colors from '@constants/colors';

interface ActionsheetProps {
  isOpen: boolean;
  onClose: (e: boolean) => void;
  onSelected: (e: string) => void;
  items: itemProps[];
  selected?: string;
}

interface itemProps {
  text: string;
  value: string;
}

const CustomActionsheet = ({
  isOpen,
  onClose,
  items,
  selected,
  onSelected,
}: ActionsheetProps) => {
  return (
    <Actionsheet isOpen={isOpen} onClose={() => onClose(false)} zIndex={999}>
      <ActionsheetBackdrop />
      <ActionsheetContent h="$72" zIndex={999}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        {items.map(({value, text}) => (
          <ActionsheetItem key={value} onPress={() => onSelected(value)}>
            <ActionsheetItemText
              style={{
                color: selected == value ? colors.green : colors.primaryText,
              }}>
              {text}
            </ActionsheetItemText>
          </ActionsheetItem>
        ))}
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default CustomActionsheet;

const styles = StyleSheet.create({});
