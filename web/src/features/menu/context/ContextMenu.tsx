import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { Box, createStyles, Flex, Stack, Text, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ContextMenuProps } from '../../../typings';
import ContextButton from './components/ContextButton';
import { fetchNui } from '../../../utils/fetchNui';
import ReactMarkdown from 'react-markdown';
import HeaderButton from './components/HeaderButton';
import LibIcon from '../../../components/LibIcon';
import ScaleFade from '../../../transitions/ScaleFade';
import MarkdownComponents from '../../../config/MarkdownComponents';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: true });
};

const useStyles = createStyles((theme) => ({
  wrapper: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to right, rgba(133,133,133,0) 10%, rgba(133, 133, 133, 0) 30%, rgb(43, 44, 54) 100%)',
  },
  container: {
    position: 'absolute',
    top: '18%',
    right: '4%',
    width: 320,
    height: 580,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  titleContainer: {
    borderRadius: 5,
    flex: '1 85%',
    borderWidth: '0.12rem',
    borderStyle: 'solid',
    borderColor: 'rgba(110, 110, 119, 0.925)',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.089) 0%, rgba(77, 79, 87, 0.177) 100%)',
    '&:hover': {
      transition: 'all 0.5s',
      borderColor: 'rgba(102, 51, 153, 0.925)',
      borderStyle: 'solid',
      borderWidth: '0.12rem',
      backgroundColor: 'radial-gradient(circle, rgba(38, 94, 86, 0.684) 0%, rgba(31, 79, 72, 0.256) 100%)',
    },
  },
  titleText: {
    color: theme.colors.dark[0],
    padding: 5,
    textAlign: 'center',
  },
  buttonsContainer: {
    height: 560,
    overflowY: 'scroll',
  },
  buttonsFlexWrapper: {
    gap: 3,
  },
  searchTextInput: {
    marginBottom: 3,
    borderColor: 'rgba(110, 110, 119, 0.925)',
    borderStyle: 'solid',
    borderWidth: '0.12rem',
    backgroundColor: 'radial-gradient(circle, rgba(38, 94, 86, 0.684) 0%, rgba(31, 79, 72, 0.256) 100%)',
    borderRadius: 5,
    padding: 10,
  },
}));

const ContextMenu: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const [setText, setTextInput] = useState('');
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    title: '',
    options: { '': { description: '', metadata: [] } },
  });

  const closeContext = () => {
    if (contextMenu.canClose === false) return;
    setVisible(false);
    fetchNui('closeContext');
  };

  // Hides the context menu on ESC
  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) closeContext();
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  useNuiEvent('hideContext', () => setVisible(false));

  useNuiEvent<ContextMenuProps>('showContext', async (data) => {
    if (visible) {
      setVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setContextMenu(data);
    setVisible(true);
    setTextInput('');
  });

  return (
    <Box className={classes.wrapper} style={{
      display: visible ? 'flex' : 'none'
    }}>
      <Box className={classes.container}>
        <ScaleFade visible={visible}>
          <Flex className={classes.header}>
            {contextMenu.menu && (
              <HeaderButton icon="chevron-left" iconSize={16} handleClick={() => openMenu(contextMenu.menu)} />
            )}
            <Box className={classes.titleContainer}>
              <Text className={classes.titleText}>
                <ReactMarkdown components={MarkdownComponents}>{contextMenu.title}</ReactMarkdown>
              </Text>
            </Box>
            <HeaderButton icon="xmark" canClose={contextMenu.canClose} iconSize={18} handleClick={closeContext} />
          </Flex>
          <Box className={classes.searchTextInput}>
          <TextInput
            styles={{ 
              input: { backgroundColor: 'rgba(110, 110, 119, 0.13)'},
            }}
            icon={ <LibIcon icon={"magnifying-glass"} fontSize={20} fixedWidth /> }
            onChange={(event) => {
              var lowerCase = event.target.value.toLowerCase();
              setTextInput(lowerCase);
            }}
            placeholder='Search...'
          />
        </Box>
          <Box className={classes.buttonsContainer}>
            <Stack className={classes.buttonsFlexWrapper}>
              {Object.entries(contextMenu.options).map((option, index) => 
                setText !== '' ? (
                  ((option[1].title && option[1].title.toLowerCase().includes(setText.toLowerCase())) ||
                    (option[1].description &&
                      option[1].description.toLowerCase().includes(setText.toLowerCase()))) && (
                    <ContextButton option={option} key={`context-item-${index}`} />
                  )
                ) : (
                  <ContextButton option={option} key={`context-item-${index}`} />
                )
              )}
            </Stack>
          </Box>
        </ScaleFade>
      </Box>
    </Box>
  );
};

export default ContextMenu;
