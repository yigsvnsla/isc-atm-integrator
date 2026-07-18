import { VersioningOptions, VersioningType } from '@nestjs/common';

export const versioningSetup: VersioningOptions = {
    type: VersioningType.HEADER,
    header: 'x-api-version',
};
