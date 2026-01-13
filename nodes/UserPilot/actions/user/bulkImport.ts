/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { userPilotApiFileUpload } from '../../transport';

export async function bulkImport(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index, 'data') as string;
  const items = this.getInputData();
  const item = items[index];

  if (!item.binary || !item.binary[binaryPropertyName]) {
    throw new Error(`No binary data found in property "${binaryPropertyName}"`);
  }

  const binaryData = item.binary[binaryPropertyName];
  const fileBuffer = await this.helpers.getBinaryDataBuffer(index, binaryPropertyName);
  const fileName = binaryData.fileName || 'users.csv';

  const response = await userPilotApiFileUpload.call(
    this,
    '/v1/users/import',
    fileBuffer,
    fileName,
  );

  return [
    {
      json: {
        success: true,
        file_name: fileName,
        ...response,
      },
    },
  ];
}
