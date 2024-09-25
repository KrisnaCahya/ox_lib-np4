import { Button, createStyles, Group, HoverCard, Image, Progress, Stack, Text } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { ContextMenuProps, Option } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { isIconUrl } from '../../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import MarkdownComponents from '../../../../config/MarkdownComponents';
import LibIcon from '../../../../components/LibIcon';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: false });
};

const clickContext = (id: string) => {
  fetchNui('clickContext', id);
};

const useStyles = createStyles((theme, params: { disabled?: boolean; readOnly?: boolean }) => ({
  inner: {
    justifyContent: 'flex-start',
  },
  label: {
    width: '100%',
    color: params.disabled ? theme.colors.dark[3] : theme.colors.dark[0],
    whiteSpace: 'pre-wrap',
  },
  button: {
    height: 'fit-content',
    width: '100%',
    transition: 'all 0.5s',
    borderColor: params.disabled ? 'rgb(119, 80, 169)' : 'rgba(110, 110, 119, 0.925)',
    borderStyle: 'solid',
    borderWidth: '0.12rem',
    background: params.disabled ? 'radial-gradient(circle, rgba(255, 255, 255, 0.089) 0%, rgba(77, 79, 87, 0.177) 100%) !important' : 'radial-gradient(circle, rgba(255, 255, 255, 0.089) 0%, rgba(77, 79, 87, 0.177) 100%)',
    padding: 10,
    '&:hover': {
      transition: 'all 0.5s',
      borderColor: params.disabled ? 'rgb(119, 80, 169)' : 'rgba(102, 51, 153, 0.925)',
      borderStyle: 'solid',
      borderWidth: '0.12rem',
      backgroundColor: params.readOnly ? 'radial-gradient(circle, rgba(38, 94, 86, 0.684) 0%, rgba(31, 79, 72, 0.256) 100%)' : 'radial-gradient(circle, rgba(138, 114, 190, 0.089) 0%, rgba(119, 80, 169, 0.177) 100%) !important',
      cursor: params.readOnly ? 'unset' : 'pointer',
    },
    '&:active': {
      transform: params.readOnly ? 'unset' : undefined,
    },
  },
  iconImage: {
    maxWidth: '25px',
  },
  description: {
    color: params.disabled ? 'radial-gradient(circle, rgba(138, 114, 190, 0.089) 0%, rgba(119, 80, 169, 0.177) 100%) !important' : 'radial-gradient(circle, rgba(38, 94, 86, 0.684) 0%, rgba(31, 79, 72, 0.256) 100%)',
    fontSize: 12,
  },
  dropdown: {
    padding: 10,
    color: theme.colors.dark[0],
    borderStyle: 'solid',
    borderWidth: '0.12rem',
    borderColor: 'rgba(110, 110, 119, 0.925)',
    background: 'radial-gradient(circle, rgba(138, 114, 190, 0.925) 50%, rgba(119, 80, 169, 0.925) 100%)',
    fontSize: 14,
    maxWidth: 256,
    width: 'fit-content',
    border: 'none',
  },
  buttonStack: {
    gap: 4,
    flex: '1',
  },
  buttonGroup: {
    gap: 4,
    flexWrap: 'nowrap',
  },
  buttonIconContainer: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitleText: {
    overflowWrap: 'break-word',
  },
  buttonArrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
    height: 25,
  },
}));

const ContextButton: React.FC<{
  option: [string, Option];
}> = ({ option }) => {
  const button = option[1];
  const buttonKey = option[0];
  const { classes } = useStyles({ disabled: button.disabled, readOnly: button.readOnly });

  return (
    <>
      <HoverCard
        position="right-start"
        disabled={button.disabled || !(button.metadata || button.image)}
        openDelay={200}
      >
        <HoverCard.Target>
          <Button
            classNames={{ inner: classes.inner, label: classes.label, root: classes.button }}
            onClick={() =>
              !button.disabled && !button.readOnly
                ? button.menu
                  ? openMenu(button.menu)
                  : clickContext(buttonKey)
                : null
            }
            variant="default"
            disabled={button.disabled}
          >
            <Group position="apart" w="100%" noWrap>
              <Stack className={classes.buttonStack}>
                {(button.title || Number.isNaN(+buttonKey)) && (
                  <Group className={classes.buttonGroup}>
                    {button?.icon && (
                      <Stack className={classes.buttonIconContainer}>
                        {typeof button.icon === 'string' && isIconUrl(button.icon) ? (
                          <img src={button.icon} className={classes.iconImage} alt="Missing img" />
                        ) : (
                          <LibIcon
                            icon={button.icon as IconProp}
                            fixedWidth
                            size="lg"
                            style={{ color: button.iconColor }}
                            animation={button.iconAnimation}
                          />
                        )}
                      </Stack>
                    )}
                    <Text className={classes.buttonTitleText}>
                      <ReactMarkdown components={MarkdownComponents}>{button.title || buttonKey}</ReactMarkdown>
                    </Text>
                  </Group>
                )}
                {button.description && (
                  <Text className={classes.description}>
                    <ReactMarkdown components={MarkdownComponents}>{button.description}</ReactMarkdown>
                  </Text>
                )}
                {button.progress !== undefined && (
                  <Progress value={button.progress} size="sm" color={button.colorScheme || 'dark.2'} />
                )}
              </Stack>
              {(button.menu || button.arrow) && button.arrow !== false && (
                <Stack className={classes.buttonArrowContainer}>
                  <LibIcon icon="chevron-right" fixedWidth />
                </Stack>
              )}
            </Group>
          </Button>
        </HoverCard.Target>
        <HoverCard.Dropdown className={classes.dropdown}>
          {button.image && <Image src={button.image} />}
          {Array.isArray(button.metadata) ? (
            button.metadata.map(
              (
                metadata: string | { label: string; value?: any; progress?: number; colorScheme?: string },
                index: number
              ) => (
                <>
                  <Text key={`context-metadata-${index}`}>
                    {typeof metadata === 'string' ? `${metadata}` : `${metadata.label}: ${metadata?.value ?? ''}`}
                  </Text>

                  {typeof metadata === 'object' && metadata.progress !== undefined && (
                    <Progress
                      value={metadata.progress}
                      size="sm"
                      color={metadata.colorScheme || button.colorScheme || 'dark.3'}
                    />
                  )}
                </>
              )
            )
          ) : (
            <>
              {typeof button.metadata === 'object' &&
                Object.entries(button.metadata).map((metadata: { [key: string]: any }, index) => (
                  <Text key={`context-metadata-${index}`}>
                    {metadata[0]}: {metadata[1]}
                  </Text>
                ))}
            </>
          )}
        </HoverCard.Dropdown>
      </HoverCard>
    </>
  );
};

export default ContextButton;
