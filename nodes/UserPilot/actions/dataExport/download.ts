/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { userPilotApiRequest } from '../../transport';

export async function download(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const jobId = this.getNodeParameter('jobId', index) as string;

  // First get the export status to check if ready and get download URL
  const statusResponse = await userPilotApiRequest.call(
    this,
    'GET',
    `/v1/exports/${encodeURIComponent(jobId)}`,
  );

  if (statusResponse.status !== 'completed') {
    return [
      {
        json: {
          success: false,
          job_id: jobId,
          status: statusResponse.status,
          message: 'Export is not yet completed. Please try again later.',
        },
      },
    ];
  }

  if (!statusResponse.download_url) {
    return [
      {
        json: {
          success: false,
          job_id: jobId,
          status: statusResponse.status,
          message: 'No download URL available for this export.',
        },
      },
    ];
  }

  // Download the file
  const downloadUrl = statusResponse.download_url;
  const fileResponse = await this.helpers.httpRequest({
    method: 'GET',
    url: downloadUrl,
    encoding: 'arraybuffer',
  });

  const binaryData = await this.helpers.prepareBinaryData(
    Buffer.from(fileResponse as ArrayBuffer),
    `export_${jobId}.csv`,
    'text/csv',
  );

  return [
    {
      json: {
        success: true,
        job_id: jobId,
        status: 'completed',
      },
      binary: {
        data: binaryData,
      },
    },
  ];
}
