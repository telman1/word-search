import { jsx } from 'react/jsx-runtime';
import { ArrowLeft, ArrowRight } from '@strapi/icons';
import { useNotification } from '@strapi/admin/strapi-admin';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';

const WORD_ENTRY_UID = 'api::word-entry.word-entry';

function neighborsPath(documentId) {
  return `/api/word-entries/${encodeURIComponent(documentId)}/neighbors`;
}

async function fetchNeighbors(documentId) {
  const res = await fetch(neighborsPath(documentId), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    const err = new Error('Neighbors request failed');
    err.status = res.status;
    throw err;
  }
  return res.json();
}

const WordEntryPreviousAction = (props) => {
  const { documentId, model, collectionType } = props;
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();

  if (collectionType !== 'collection-types' || model !== WORD_ENTRY_UID || !documentId) {
    return null;
  }

  return {
    id: 'word-entry-nav-previous',
    label: formatMessage({
      id: 'word-entry.nav.previous',
      defaultMessage: 'Previous entry',
    }),
    icon: jsx(ArrowLeft, {}),
    position: 'header',
    onClick: async () => {
      try {
        const json = await fetchNeighbors(documentId);
        const prevId = json?.data?.prevDocumentId;
        if (prevId) {
          navigate(
            `/content-manager/collection-types/${WORD_ENTRY_UID}/${encodeURIComponent(prevId)}`
          );
        } else {
          toggleNotification({
            type: 'info',
            message: formatMessage({
              id: 'word-entry.nav.noPrevious',
              defaultMessage: 'No previous entry in id order',
            }),
          });
        }
      } catch (e) {
        toggleNotification({
          type: 'warning',
          message: formatMessage({
            id: 'word-entry.nav.error',
            defaultMessage: 'Could not load sibling entries',
          }),
        });
      }
    },
  };
};

const WordEntryNextAction = (props) => {
  const { documentId, model, collectionType } = props;
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();

  if (collectionType !== 'collection-types' || model !== WORD_ENTRY_UID || !documentId) {
    return null;
  }

  return {
    id: 'word-entry-nav-next',
    label: formatMessage({
      id: 'word-entry.nav.next',
      defaultMessage: 'Next entry',
    }),
    icon: jsx(ArrowRight, {}),
    position: 'header',
    onClick: async () => {
      try {
        const json = await fetchNeighbors(documentId);
        const nextId = json?.data?.nextDocumentId;
        if (nextId) {
          navigate(
            `/content-manager/collection-types/${WORD_ENTRY_UID}/${encodeURIComponent(nextId)}`
          );
        } else {
          toggleNotification({
            type: 'info',
            message: formatMessage({
              id: 'word-entry.nav.noNext',
              defaultMessage: 'No next entry in id order',
            }),
          });
        }
      } catch (e) {
        toggleNotification({
          type: 'warning',
          message: formatMessage({
            id: 'word-entry.nav.error',
            defaultMessage: 'Could not load sibling entries',
          }),
        });
      }
    },
  };
};

const config = {
  locales: [],
};

function register(app) {
  const cm = app.getPlugin('content-manager');
  if (!cm?.apis?.addDocumentHeaderAction) {
    return;
  }
  cm.apis.addDocumentHeaderAction([WordEntryPreviousAction, WordEntryNextAction]);
}

export default {
  config,
  register,
};
