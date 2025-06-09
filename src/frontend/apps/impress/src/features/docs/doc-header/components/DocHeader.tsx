import { Tooltip } from '@openfun/cunningham-react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

import { Box, HorizontalSeparator, Text } from '@/components';
import { useCunninghamTheme } from '@/cunningham';
import {
  Doc,
  LinkReach,
  Role,
  currentDocRole,
  useIsCollaborativeEditable,
  useTrans,
} from '@/docs/doc-management';
import { useResponsiveStore } from '@/stores';

import { AlertNetwork } from './AlertNetwork';
import { AlertPublic } from './AlertPublic';
import { DocTitle } from './DocTitle';
import { DocToolBox } from './DocToolBox';

interface DocHeaderProps {
  doc: Doc;
}

const countWords = (text: string): number => {
  return text ? text.trim().split(/\s+/).length : 0;
};
const estimateReadTime = (wordCount: number): string => {
  const wordsPerMinute = 200; // Average reading speed
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes > 0 ? `${minutes} min read` : 'Less than a minute';
};

export const DocHeader = ({ doc }: DocHeaderProps) => {
  const { spacingsTokens } = useCunninghamTheme();
  const { isDesktop } = useResponsiveStore();
  const { t } = useTranslation();
  const { transRole } = useTrans();
  const { isEditable } = useIsCollaborativeEditable(doc);
  const docIsPublic = doc.link_reach === LinkReach.PUBLIC;
  const docIsAuth = doc.link_reach === LinkReach.AUTHENTICATED;

  const wordCount = countWords(doc.content);
  const readTime = estimateReadTime(wordCount);

  return (
    <>
      <Box
        $width="100%"
        $padding={{ top: isDesktop ? '50px' : 'md' }}
        $gap={spacingsTokens['base']}
        aria-label={t('It is the card information about the document.')}
        className="--docs--doc-header"
      >
        {!isEditable && <AlertNetwork />}
        {(docIsPublic || docIsAuth) && (
          <AlertPublic isPublicDoc={docIsPublic} />
        )}
        <Box
          $direction="row"
          $align="center"
          $width="100%"
          $padding={{ bottom: 'xs' }}
        >
          <Box
            $direction="row"
            $justify="space-between"
            $css="flex:1;"
            $gap="0.5rem 1rem"
            $align="center"
            $maxWidth="100%"
          >
            <Box $gap={spacingsTokens['3xs']} $overflow="auto">
              <DocTitle doc={doc} />

              <Box $direction="row">
                {isDesktop && (
                  <>
                    <Text
                      $variation="600"
                      $size="s"
                      $weight="bold"
                      $theme={isEditable ? 'greyscale' : 'warning'}
                    >
                      {transRole(
                        isEditable
                          ? currentDocRole(doc.abilities)
                          : Role.READER,
                      )}
                      &nbsp;·&nbsp;
                    </Text>
                    <Text $variation="600" $size="s">
                      {t('Last update: {{update}}', {
                        update: DateTime.fromISO(doc.updated_at).toRelative(),
                      })}
                    </Text>
                    <Text>
                      <Tooltip content={readTime} placement="bottom">
                        <Text
                          $variation="600"
                          $size="s"
                          className="--docs--doc-wordcount"
                          $theme="greyscale"
                        >
                          &nbsp;·&nbsp;
                          {t('{{count}} words', { count: wordCount })}
                        </Text>
                      </Tooltip>
                    </Text>
                  </>
                )}
                {!isDesktop && (
                  <Text $variation="400" $size="s">
                    {DateTime.fromISO(doc.updated_at).toRelative()}
                  </Text>
                )}
              </Box>
            </Box>
            <DocToolBox doc={doc} />
          </Box>
        </Box>
        <HorizontalSeparator $withPadding={false} />
      </Box>
    </>
  );
};
