/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {mapValues} from 'lodash';
import {normalizeUrl} from '@docusaurus/utils';
import type {Sidebars} from './sidebars/types';
import {createSidebarsUtils} from './sidebars/utils';
import type {
  DocMetadata,
  GlobalDoc,
  LoadedVersion,
  GlobalVersion,
  GlobalSidebar,
} from './types';

export function toGlobalDataDoc(doc: DocMetadata): GlobalDoc {
  return {
    id: doc.unversionedId,
    path: doc.permalink,
    sidebar: doc.sidebar,
  };
}

export function toGlobalSidebars(
  sidebars: Sidebars,
  version: LoadedVersion,
): Record<string, GlobalSidebar> {
  const {getFirstLink} = createSidebarsUtils(sidebars);
  return mapValues(sidebars, (sidebar, sidebarId) => {
    const firstLink = getFirstLink(sidebarId);
    if (!firstLink) {
      return {};
    }
    return {
      link: {
        path:
          firstLink.type === 'generated-index'
            ? normalizeUrl([version.versionPath, firstLink.slug])
            : version.docs.find(
                (doc) =>
                  doc.id === firstLink.id || doc.unversionedId === firstLink.id,
              )!.permalink,
        label: firstLink.label,
      },
    };
  });
}

export function toGlobalDataVersion(version: LoadedVersion): GlobalVersion {
  return {
    name: version.versionName,
    label: version.versionLabel,
    isLast: version.isLast,
    path: version.versionPath,
    mainDocId: version.mainDocId,
    docs: version.docs.map(toGlobalDataDoc),
    sidebars: toGlobalSidebars(version.sidebars, version),
  };
}
